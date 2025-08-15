import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Professional } from './professionals.entity';

@Entity('services')
export class ServiceOffering {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Professional, (p) => p.services)
  @JoinColumn({ name: 'pro_id' })
  pro: Professional;

  @Column({ name: 'pro_id' })
  proId: number;

  @Column()
  title: string;

  @Column('int', { name: 'duration_min' })
  durationMin: number;

  @Column('int', { name: 'price_cents' })
  priceCents: number;

  @Column({ default: 'USD' })
  currency: string;
}