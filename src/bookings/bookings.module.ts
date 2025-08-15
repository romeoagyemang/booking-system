import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './bookings.entity';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { ServiceOffering } from '../professionals/service.entity';
import { AvailabilityWindow } from '../professionals/availability.entity';
import { TimeOff } from '../professionals/timeoff.entity';
import { IdempotencyInterceptor } from '../common/interceptors/idempotency.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, ServiceOffering, AvailabilityWindow, TimeOff])],
  providers: [BookingsService, { provide: APP_INTERCEPTOR, useClass: IdempotencyInterceptor }],
  controllers: [BookingsController],
})
export class BookingsModule {}

export { Booking };
