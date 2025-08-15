import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Professional } from './professionals.entity';
import { SearchProsDto } from './dto/search-pros.dto';

@Injectable()
export class ProfessionalsService {
  constructor(@InjectRepository(Professional) private readonly pros: Repository<Professional>) {}

  async search(q: SearchProsDto) {
    const speedKmh = q.travelMode === 'walking' ? 5 : q.travelMode === 'biking' ? 15 : 40;
    const radiusKm = q.radiusKm ?? Math.max(1, Math.min(50, Math.floor(speedKmh)));

    const qb = this.pros
      .createQueryBuilder('p')
      .addSelect(
        `(
          2 * 6371 * asin(
            sqrt(
              pow(sin(radians((p.lat - :lat)/2)), 2) +
              cos(radians(:lat)) * cos(radians(p.lat)) * pow(sin(radians((p.lng - :lng)/2)), 2)
            )
          )
        )`,
        'distance_km',
      )
      .where('1=1')
      .andWhere(':category IS NULL OR p.category = :category', { category: q.category ?? null })
      .andWhere(':maxPrice IS NULL OR p.min_price_cents <= :maxPrice', { maxPrice: q.maxPriceCents ?? null })
      .having('distance_km <= :radius', { radius: radiusKm })
      .setParameters({ lat: q.lat, lng: q.lng })
      .orderBy('distance_km', 'ASC')
      .limit(50);

    const { entities, raw } = await qb.getRawAndEntities();
    return entities.map((p, i) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      minPriceCents: p.minPriceCents,
      currency: p.currency,
      distanceKm: Number(raw[i]['distance_km'] ?? 0),
    }));
  }
}