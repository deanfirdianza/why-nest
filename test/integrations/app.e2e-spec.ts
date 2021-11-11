import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { name, description, version } from '../../package.json';
import { ResponseTransformInterceptor } from '../../src/common/interceptors';
import { HttpExceptionFilter } from '../../src/common/filters';
import { ValidatePayloadExistPipe } from '../../src/common/pipes';
import { MockAppModule } from './modules';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MockAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalInterceptors(new ResponseTransformInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes(new ValidatePayloadExistPipe(), new ValidationPipe());
    await app.init();
  });

  describe('[GET]', () => {
    describe('/', () => {
      it('Should return App info', async () => {
        return request(app.getHttpServer())
          .get('/')
          .then(({ body, status }) => {
            const { meta, data, errors } = body;
            expect(status).toBe(200);
            expect(meta).toHaveProperty('code', 200);
            expect(meta).toHaveProperty('message', 'OK');
            expect(meta).toHaveProperty('success', true);
            expect(meta).toHaveProperty('time');
            expect(errors).toEqual([]);
            expect(data).toEqual({ name, description, version });
          });
      });
    });
  });
});
