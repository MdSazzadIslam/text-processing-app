import { Controller, Get } from '@nestjs/common';
import { TextService } from './text.service';

@Controller()
export class TextController {
  constructor(private readonly textService: TextService) {}

  @Get()
  getHello(): string {
    return this.textService.getHello();
  }
}
