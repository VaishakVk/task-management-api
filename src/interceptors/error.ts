import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';

@Catch()
export class ErrorInterceptor implements ExceptionFilter {
  constructor(private loggerService: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Something went wrong';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseBody = exception.getResponse();
      message =
        typeof responseBody === 'string'
          ? responseBody
          : (responseBody as any).message || message;
    }

    this.loggerService.error(
      `Error while triggering request - ${request.url} with message ${message}`,
    );
    this.loggerService.error(exception as any);
    response.status(status).json({
      success: false,
      message,
    });
  }
}
