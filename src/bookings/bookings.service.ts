import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Booking } from './bookings.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ServiceOffering } from '../professionals/service.entity';
import { AvailabilityWindow } from '../professionals/availability.entity';
import { TimeOff } from '../professionals/timeoff.entity';

@Injectable()
export class BookingsService {
  constructor(
    private readonly db: DataSource,
    @InjectRepository(Booking) private readonly bookings: Repository<Booking>,
    @InjectRepository(ServiceOffering) private readonly services: Repository<ServiceOffering>,
    @InjectRepository(AvailabilityWindow) private readonly windows: Repository<AvailabilityWindow>,
    @InjectRepository(TimeOff) private readonly timeoff: Repository<TimeOff>,
  ) {}

  async createBooking(dto: CreateBookingDto, clientId = 1, idempotencyKey?: string) {
    const service = await this.services.findOne({ where: { id: dto.serviceId, proId: dto.proId } });
    if (!service) throw new BadRequestException('Invalid service or pro');

    const start = new Date(dto.startTime);
    if (isNaN(start.getTime())) throw new BadRequestException('Invalid startTime');
    const end = new Date(start.getTime() + service.durationMin * 60 * 1000);

    // Availability check (UTC simplified)
    const weekday = start.getUTCDay();
    const startMin = start.getUTCHours() * 60 + start.getUTCMinutes();
    const within = await this.windows
      .createQueryBuilder('w')
      .where('w.pro_id = :proId', { proId: dto.proId })
      .andWhere('w.weekday = :weekday', { weekday })
      .andWhere('w.start_min <= :startMin AND w.end_min >= :endMin', { startMin, endMin: startMin + service.durationMin })
      .getExists();
    if (!within) throw new BadRequestException('Outside availability');

    const clashOff = await this.timeoff
      .createQueryBuilder('t')
      .where('t.pro_id = :proId', { proId: dto.proId })
      .andWhere('(t.start_ts, t.end_ts) OVERLAPS (:start, :end)', { start, end })
      .getExists();
    if (clashOff) throw new BadRequestException('Pro is unavailable');

    const totalPrice = service.priceCents;

    return this.db.transaction('SERIALIZABLE', async (mgr) => {
      if (idempotencyKey) {
        const existing = await mgr.getRepository(Booking).findOne({ where: { idempotencyKey } });
        if (existing) return existing;
      }

      const overlap = await mgr
        .getRepository(Booking)
        .createQueryBuilder('b')
        .where('b.pro_id = :proId', { proId: dto.proId })
        .andWhere("tstzrange(b.start_ts, b.end_ts, '[)') && tstzrange(:start,:end,'[)')")
        .andWhere("b.status IN ('PENDING','CONFIRMED')")
        .setParameters({ start, end })
        .getExists();
      if (overlap) throw new ConflictException('Slot already booked');

      const booking = mgr.getRepository(Booking).create({
        clientId,
        proId: dto.proId,
        serviceId: dto.serviceId,
        startTs: start,
        endTs: end,
        priceCents: totalPrice,
        currency: service.currency,
        status: 'PENDING',
        idempotencyKey: idempotencyKey || null,
      });

      try {
        return await mgr.getRepository(Booking).save(booking);
      } catch (e: any) {
        if (e.code === '23P01' || e.code === '23505') {
          throw new ConflictException('Slot conflict or duplicate');
        }
        throw e;
      }
    });
  }
}

