import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Professional } from './professionals.entity';
import { ProfessionalsService } from './professionals.service';
import { ProfessionalsController } from './professionals.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Professional])],
  providers: [ProfessionalsService],
  controllers: [ProfessionalsController],
})
export class ProfessionalsModule {}

