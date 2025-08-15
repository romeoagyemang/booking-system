import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class SearchProsDto {
  @IsNumber() lat: number;
  @IsNumber() lng: number;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsNumber() maxPriceCents?: number;
  @IsOptional() @IsIn(['driving', 'walking', 'biking']) travelMode?: 'driving' | 'walking' | 'biking';
  @IsOptional() @IsNumber() radiusKm?: number;
}