import { Injectable } from '@nestjs/common';
import { name, description, version } from '../package.json';

@Injectable()
export class AppService {
  getInfo() {
    return { name, description, version };
  }
}
