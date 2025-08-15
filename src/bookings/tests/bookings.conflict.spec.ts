import { ConflictException } from '@nestjs/common';
import { BookingsService } from '../../bookings/bookings.service';

describe('Bookings conflict detection', () => {
  it('throws on overlapping slot', async () => {
    const svc = new BookingsService(
      { transaction: async (_i: any, fn: any) => fn({ getRepository: () => ({
        createQueryBuilder: () => ({ where: () => ({ andWhere: () => ({ setParameters: () => ({ getExists: async () => true }) }) }) })
      }) }) } as any,
      { } as any,
      { findOne: async () => ({ id: 1, proId: 1, durationMin: 60, priceCents: 8000, currency: 'USD' }) } as any,
      { createQueryBuilder: () => ({ where: () => ({ andWhere: () => ({ getExists: async () => true }) }) }) } as any,
      { createQueryBuilder: () => ({ where: () => ({ andWhere: () => ({ getExists: async () => false }) }) }) } as any,
    );
    await expect(
      svc.createBooking({ proId: 1, serviceId: 1, startTime: new Date().toISOString() }, 1, 'k'),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});