import { Controller, Get, Query } from '@nestjs/common';
import { ProfessionalsService } from './professionals.service';
import { SearchProsDto } from './dto/search-pros.dto';

@Controller('search')
export class ProfessionalsController {
  constructor(private readonly svc: ProfessionalsService) {}

  @Get('pros')
  search(@Query() q: SearchProsDto) {
    return this.svc.search(q);
  }
}