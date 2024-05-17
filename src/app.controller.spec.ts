import { Test, TestingModule } from '@nestjs/testing';
import { TextController } from './text.controller';
import { TextService } from './text.service';

describe('AppController', () => {
  let appController: TextController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TextController],
      providers: [TextService],
    }).compile();

    appController = app.get<TextController>(TextController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
