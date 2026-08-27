import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Injectable()
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    httpAdapter.reply(
      ctx.getResponse(),
      {
        ...(typeof exceptionResponse === 'object' && exceptionResponse !== null
          ? exceptionResponse
          : { message: exceptionResponse }),
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
      },
      status,
    );
  }
}
