import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ServiceOffering } from './service.entity';
import { Booking } from '../bookings/bookings.entity';
import { TimeOff } from './timeoff.entity'; 

@Entity('pros')
export class Professional {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column('double precision')
  lat: number;

  @Column('double precision')
  lng: number;

  @Column('int', { name: 'min_price_cents' })
  minPriceCents: number;

  @Column({ default: 'USD' })
  currency: string;

  @OneToMany(() => ServiceOffering, (s) => s.pro)
  services: ServiceOffering[];

  @OneToMany(() => Booking, (b) => b.pro)
  bookings: Booking[];

  @OneToMany(() => TimeOff, (timeOff) => timeOff.professional)
timeOff: TimeOff[];
}