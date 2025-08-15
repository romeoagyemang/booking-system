import { BookingsService } from '../../bookings/bookings.service';

describe('Bookings idempotency', () => {
  it('returns existing booking when idempotency key repeats', async () => {
    const existing = { id: 99 };
    const svc = new BookingsService(
      { transaction: async (_i: any, fn: any) => fn({ getRepository: () => ({
        findOne: async () => existing,
        createQueryBuilder: () => ({ where: () => ({ andWhere: () => ({ setParameters: () => ({ getExists: async () => false }) }) }) }),
        create: (x: any) => x,
        save: async (x: any) => x,
      }) }) } as any,
      { } as any,
      { findOne: async () => ({ id: 1, proId: 1, durationMin: 60, priceCents: 8000, currency: 'USD' }) } as any,
      { createQueryBuilder: () => ({ where: () => ({ andWhere: () => ({ getExists: async () => true }) }) }) } as any,
      { createQueryBuilder: () => ({ where: () => ({ andWhere: () => ({ getExists: async () => false }) }) }) } as any,
    );
    const res = await svc.createBooking({ proId: 1, serviceId: 1, startTime: new Date().toISOString() }, 1, 'same');
    expect(res).toBe(existing as any);
  });
});