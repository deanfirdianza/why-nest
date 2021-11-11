import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfig implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    if (this.configService.get('NODE_ENV') === 'local') {
      return JSON.parse(this.configService.get('LOCAL_ENV'));
    }

    const username = this.configService.get('TYPEORM_USERNAME');
    const password = this.configService.get('TYPEORM_PASSWORD');
    const database = this.configService.get('TYPEORM_DATABASE');

    return {
      type: this.configService.get('TYPEORM_CONNECTION'),
      entities: ['dist/**/*.entity{.ts,.js}'],
      migrations: ['dist/src/database/migrations/*{.ts,.js}'],
      replication: {
        master: {
          host: this.configService.get('TYPEORM_PRIMARY_HOST'),
          port: +this.configService.get<number>('TYPEORM_PRIMARY_PORT'),
          username,
          password,
          database,
        },
        slaves: [
          {
            host: this.configService.get('TYPEORM_SECONDARY_HOST'),
            port: +this.configService.get<number>('TYPEORM_SECONDARY_PORT'),
            username,
            password,
            database,
          },
        ],
      },
      migrationsTableName: this.configService.get(
        'TYPEORM_MIGRATIONS_TABLE_NAME',
      ),
      cli: {
        migrationsDir: this.configService.get('TYPEORM_MIGRATIONS_DIR'),
      },
      synchronize:
        this.configService.get('TYPEORM_SYNCHRONIZE') === 'true' ? true : false,
      keepConnectionAlive:
        this.configService.get('TYPEORM_KEEP_CONNECTION_ALIVE') === 'true'
          ? true
          : false,
      autoLoadEntities:
        this.configService.get('TYPEORM_AUTO_LOAD_ENTITIES') === 'true'
          ? true
          : false,
      logging:
        this.configService.get('TYPEORM_LOGGING') === 'true' ? true : false,
    };
  }
}
