import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Professional } from './professionals.entity';

@Entity()
export class TimeOff {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Professional, (pro) => pro.timeOff, { onDelete: 'CASCADE' })
  professional: Professional;

  @Column({ type: 'timestamptz' })
  start: Date;

  @Column({ type: 'timestamptz' })
  end: Date;
}
