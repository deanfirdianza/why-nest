import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import { CommonDto } from '../dtos';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
  Logger,
  HttpException,
  ConflictException,
} from '@nestjs/common';

@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, CommonDto>
{
  private readonly logger = new Logger('RequestLogger');

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<CommonDto> {
    const { /* params, */ route, url, now, method } = context.getArgByIndex(0);
    const response: CommonDto = { meta: {}, data: {}, errors: [] };

    return next.handle().pipe(
      map((data) => {
        if (data) response.data = data;

        const metaPayload = {
          success: true,
          time: new Date(),
        };

        switch (Object.keys(route.methods)[0]) {
          case 'post':
            response.meta = {
              code: HttpStatus.CREATED,
              message: 'CREATED',
              ...metaPayload,
            };
            break;
          case 'delete':
            response.meta = {
              code: HttpStatus.NO_CONTENT,
              message: 'NO_CONTENT',
              ...metaPayload,
            };
          case 'get':
          case 'put':
          case 'patch':
            response.meta = {
              code: HttpStatus.OK,
              message: 'OK',
              ...metaPayload,
            };
            break;
        }

        if (url !== '/') {
          // * LOG TIME AND REQUEST
          this.logger.log(
            `${method} {${url}} ${response.meta.code} +${Date.now() - now}ms`,
          );
        }

        return new CommonDto(response);
      }),
      catchError((err) => {
        Logger.error(err, 'Interceptor');
        let errorFactory: HttpException;
        response.meta = { success: false, time: new Date() };

        switch (err?.constructor) {
          case QueryFailedError:
            if (err?.constraint?.includes('UQ_')) {
              response.meta = {
                code: HttpStatus.CONFLICT,
                message: 'CONFLICT',
                ...response.meta,
              };

              response.errors.push(err.detail);
              errorFactory = new ConflictException(new CommonDto(response));
            } else {
              response.meta = {
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'INTERNAL_SERVER_ERROR',
                ...response.meta,
              };

              errorFactory = new InternalServerErrorException(
                new CommonDto(response),
              );
            }
            break;
          case EntityNotFoundError:
            response.meta = {
              code: HttpStatus.NOT_FOUND,
              message: 'NOT_FOUND',
              ...response.meta,
            };

            response.errors.push(`Cannot found ${err.message.split('"')[1]}`);
            errorFactory = new NotFoundException(new CommonDto(response));
            break;
          case NotFoundException:
            response.meta = {
              code: HttpStatus.NOT_FOUND,
              message: 'NOT_FOUND',
              ...response.meta,
            };

            response.errors = err.getResponse().message;
            errorFactory = new NotFoundException(new CommonDto(response));
            break;
          case Error:
            response.meta = {
              code: HttpStatus.BAD_REQUEST,
              message: 'BAD_REQUEST',
              ...response.meta,
            };

            response.errors.push(err.message);
            errorFactory = new BadRequestException(new CommonDto(response));
            break;
          case BadRequestException:
            // * === ERROR VALIDATION
            response.meta = {
              code: HttpStatus.BAD_REQUEST,
              message: 'BAD_REQUEST',
              ...response.meta,
            };

            response.errors = err.getResponse().message;
            errorFactory = new BadRequestException(new CommonDto(response));
            break;
          default:
            response.meta = {
              code: HttpStatus.INTERNAL_SERVER_ERROR,
              message: 'INTERNAL_SERVER_ERROR',
              ...response.meta,
            };

            errorFactory = new InternalServerErrorException(
              new CommonDto(response),
            );
        }

        return throwError(() => errorFactory);
      }),
    );
  }
}
