import { NestFactory } from '@nestjs/core';
import { TextModule } from './text.module';

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import * as compression from 'compression';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LanguageMiddleware } from './middlewares/language.middleware';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(TextModule);
  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api/v1/plek');

  app.use(helmet());
  app.use(new LanguageMiddleware().use);
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, //Limit each IP to 100 requests per windowMs
    }),
  );
  app.use(compression());

  //OpenAPI specification
  if (process.env.NODE_ENV != 'production') {
    const config = new DocumentBuilder()
      .setTitle('Plek backend code assignment')
      .setDescription('A simple text processing application')
      .setVersion('0.0.1')
      .addTag('texts')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/v1/plek', app, document);
  }

  const port = process.env.PORT;
  await app.listen(port);
  logger.log(`Server running at: http://localhost:${port}`);
}
bootstrap();
