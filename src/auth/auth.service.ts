import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private auth = { user: '', pass: '' };
  constructor(private configService: ConfigService) {
    this.auth.user = this.configService.get<string>('BASIC_AUTH_USER');
    this.auth.pass = this.configService.get<string>('BASIC_AUTH_PASS');
  }

  async validateBasic(user: string, pass: string): Promise<boolean> {
    const userMatch = this.auth.user === user;
    const passMatch = this.auth.pass === pass;

    if (userMatch && passMatch) return true;
    throw new UnauthorizedException();
  }
}
