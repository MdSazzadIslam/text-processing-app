import { Module } from '@nestjs/common';
import { TextController } from './text.controller';
import { TextService } from './text.service';
import { ConfigModule } from '@nestjs/config';
import { LanguageMiddleware } from './middlewares/language.middleware';

const envModule = ConfigModule.forRoot({
  isGlobal: true,
});

@Module({
  imports: [envModule],
  controllers: [TextController],
  providers: [TextService, LanguageMiddleware],
})
export class TextModule {}
