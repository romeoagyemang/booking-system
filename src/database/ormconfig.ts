import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Booking } from '../bookings/bookings.entity';
import { Professional } from '../professionals/professionals.entity';
import { ServiceOffering } from '../professionals/service.entity';
import { AvailabilityWindow } from '../professionals/availability.entity';
import { TimeOff } from '../professionals/timeoff.entity';

export const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'marketplace',
  entities: [Booking, Professional, ServiceOffering, AvailabilityWindow, TimeOff],
  synchronize: false,
};