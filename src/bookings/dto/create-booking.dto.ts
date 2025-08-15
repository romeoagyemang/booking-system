import { IsInt, IsISO8601 } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @Type(() => Number)
  @IsInt()
  serviceId: number;

  @Type(() => Number)
  @IsInt()
  proId: number;

  @IsISO8601()
  startTime: string; 
}
