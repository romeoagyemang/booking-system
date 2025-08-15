import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsModule } from './bookings/bookings.module';
import { ProfessionalsModule } from './professionals/professionals.module';
import { ormConfig } from './database/ormconfig';

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), BookingsModule, ProfessionalsModule],
})
export class AppModule {}