import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CreatedLocationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    return next.handle().pipe(
      tap((body) => {
        if (request.method !== 'POST') {
          return;
        }

        if (response.statusCode !== HttpStatus.CREATED) {
          return;
        }

        if (response.getHeader('Location')) {
          return;
        }

        if (typeof body !== 'object' || body === null || !('id' in body)) {
          return;
        }

        const collectionPath = request.path.replace(/\/$/, '');
        response.setHeader('Location', `${collectionPath}/${body.id}`);
      }),
    );
  }
}