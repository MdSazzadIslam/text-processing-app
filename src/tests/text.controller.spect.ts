import { Test, TestingModule } from '@nestjs/testing';
import { TextController } from '../text.controller';
import { TextService } from '../text.service';
import { LanguageMiddleware } from '../middlewares/language.middleware';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { TextDto } from '../dto/textDto';
import { ReportDto } from '../dto/reportDto';

describe('TextController', () => {
  let controller: TextController;
  let textService: TextService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TextController],
      providers: [TextService],
    })
      .overrideGuard(LanguageMiddleware)
      .useValue({ resolve: jest.fn() })
      .compile();

    controller = module.get<TextController>(TextController);
    textService = module.get<TextService>(TextService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('submitText', () => {
    it('should throw BadRequestException if text is not provided', () => {
      expect(() => controller.submitText({ text: '' } as TextDto)).toThrow(
        BadRequestException,
      );
    });

    it('should call textService.processText with correct text', () => {
      const processTextSpy = jest.spyOn(textService, 'processText');
      const textDto: TextDto = { text: 'Test text' };
      controller.submitText(textDto);
      expect(processTextSpy).toHaveBeenCalledWith(textDto);
    });

    it('should throw HttpException with correct message if text processing fails', () => {
      const errorMessage = 'Error processing text';
      jest.spyOn(textService, 'processText').mockImplementation(() => {
        throw new Error(errorMessage);
      });
      expect(() =>
        controller.submitText({ text: 'Test text' } as TextDto),
      ).toThrowError(
        new HttpException(
          `Oops! Something unexpected happened: ${errorMessage}`,
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('getReport', () => {
    it('should call textService.generateReport with correct reportDto', () => {
      const generateReportSpy = jest.spyOn(textService, 'generateReport');
      const reportDto: ReportDto = { numCommonWords: 10 };
      controller.getReport(reportDto);
      expect(generateReportSpy).toHaveBeenCalledWith(reportDto);
    });

    it('should throw BadRequestException if numCommonWords is not a number', () => {
      const invalidReportDto: ReportDto = {
        numCommonWords: 'invalid' as unknown as number,
      };
      expect(() => controller.getReport(invalidReportDto)).toThrow(
        BadRequestException,
      );
    });

    it('should throw HttpException with correct message if report generation fails', () => {
      const errorMessage = 'Error generating report';
      jest.spyOn(textService, 'generateReport').mockImplementation(() => {
        throw new Error(errorMessage);
      });
      expect(() =>
        controller.getReport({ numCommonWords: 10 } as ReportDto),
      ).toThrowError(
        new HttpException(
          `Oops! Something unexpected happened: ${errorMessage}`,
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });
});
