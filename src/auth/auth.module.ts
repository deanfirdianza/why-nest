import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { BasicStrategy } from './strategies/basic.strategy';

@Module({
  imports: [PassportModule, ConfigModule],
  providers: [AuthService, BasicStrategy],
})
export class AuthModule {}
