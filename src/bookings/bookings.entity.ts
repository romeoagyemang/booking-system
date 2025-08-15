import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Professional } from '../professionals/professionals.entity';
import { ServiceOffering } from '../professionals/service.entity';

type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'client_id', type: 'int' })
  clientId: number;

  @ManyToOne(() => Professional)
  @JoinColumn({ name: 'pro_id' })
  pro: Professional;

  @Column({ name: 'pro_id' })
  proId: number;

  @ManyToOne(() => ServiceOffering)
  @JoinColumn({ name: 'service_id' })
  service: ServiceOffering;

  @Column({ name: 'service_id' })
  serviceId: number;

  @Column({ type: 'timestamptz', name: 'start_ts' })
  startTs: Date;

  @Column({ type: 'timestamptz', name: 'end_ts' })
  endTs: Date;

  @Column({ type: 'int', name: 'price_cents' })
  priceCents: number;

  @Column()
  currency: string;

  @Column({ type: 'varchar' })
  status: BookingStatus;

  @Index({ unique: true })
  @Column({ name: 'idempotency_key', nullable: true })
  idempotencyKey: string | null;
}