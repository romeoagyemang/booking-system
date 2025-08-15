import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly svc: BookingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateBookingDto, @Req() req: any) {
    return this.svc.createBooking(dto, 1, req.idempotencyKey);
  }
}