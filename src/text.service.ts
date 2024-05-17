import { Injectable } from '@nestjs/common';

@Injectable()
export class TextService {
  getHello(): string {
    return 'Hello World!';
  }
}
