import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseTransformInterceptor } from './common/interceptors';
import { HttpExceptionFilter } from './common/filters';
import { ValidatePayloadExistPipe, ValidationPipe } from './common/pipes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = +process.env.SERVER_PORT || 3000;

  app.useGlobalInterceptors(new ResponseTransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidatePayloadExistPipe(), new ValidationPipe());

  await app.listen(port);
}
bootstrap();
