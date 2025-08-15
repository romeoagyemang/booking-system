import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Professional } from './professionals.entity';

@Entity('availability_windows')
export class AvailabilityWindow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Professional)
  @JoinColumn({ name: 'pro_id' })
  pro: Professional;

  @Column({ name: 'pro_id' })
  proId: number;

  @Column('int')
  weekday: number; 

  @Column('int', { name: 'start_min' })
  startMin: number;

  @Column('int', { name: 'end_min' })
  endMin: number;
}