import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const key = req.header('Idempotency-Key') || req.header('idempotency-key');
    if (!key) {
      if (req.method === 'POST' && req.path.startsWith('/bookings')) {
        throw new BadRequestException('Idempotency-Key header required');
      }
    } else {
      req.idempotencyKey = key;
    }
    return next.handle();
  }
}