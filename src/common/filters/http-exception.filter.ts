import { Request, Response } from 'express';
import { CommonDto } from '../dtos';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('RequestLogger');

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request | any>();
    const res = ctx.getResponse<Response>();
    const status = exception.getStatus();
    let response: any = exception.getResponse();

    // * Error from auth, etc.
    if (response?.constructor !== CommonDto) {
      response = {
        meta: {
          code: status,
          message: exception.message.toUpperCase(),
          success: false,
          time: new Date(),
        },
        data: {},
        errors: [exception.message],
      };
    }

    // * LOG TIME AND REQUEST
    this.logger.error(
      `${req.method} {${req.url}} ${response.meta.code} +${
        Date.now() - req.now
      }ms`,
    );
    res.status(status).json(response);
  }
}
