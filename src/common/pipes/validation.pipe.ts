import {
  Injectable,
  ValidationPipe as NestValidationPipe,
} from '@nestjs/common';

@Injectable()
export class ValidationPipe extends NestValidationPipe {
  constructor() {
    // * This will throw an error, if the object has a property that is not part of the validation class.
    super({ whitelist: true, forbidNonWhitelisted: true });
  }
}
