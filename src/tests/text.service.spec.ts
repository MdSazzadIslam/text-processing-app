import { TextService } from '../text.service';
import { BadRequestException } from '@nestjs/common';
import { TextDto } from '../dto/textDto';
import { ReportDto } from '../dto/reportDto';

describe('TextService', () => {
  let textService: TextService;

  beforeEach(() => {
    textService = new TextService();
  });

  describe('processText', () => {
    it('should process text and update word counts', () => {
      const textDto: TextDto = { text: 'This is a test text' };
      textService.processText(textDto);
      expect(textService['wordCounts']).toEqual({
        this: 1,
        is: 1,
        a: 1,
        test: 1,
        text: 1,
      });
    });

    it('should throw BadRequestException if text is empty', () => {
      const textDto: TextDto = { text: '' };
      expect(() => textService.processText(textDto)).toThrowError(
        BadRequestException,
      );
    });

    it('should ignore common words like "the"', () => {
      const textDto: TextDto = { text: 'This is the text' };
      expect(() => textService.processText(textDto)).toThrowError(
        BadRequestException,
      );
    });
  });

  describe('generateReport', () => {
    it('should generate report with default number of common words', () => {
      textService['wordCounts'] = { this: 3, is: 2, a: 1, test: 1, text: 1 };
      const reportDto: ReportDto = {};
      const report = textService.generateReport(reportDto);
      expect(report).toEqual([
        { word: 'this', count: 3 },
        { word: 'is', count: 2 },
        { word: 'a', count: 1 },
        { word: 'test', count: 1 },
        { word: 'text', count: 1 },
      ]);
    });

    it('should generate report with specified number of common words', () => {
      textService['wordCounts'] = { this: 3, is: 2, a: 1, test: 1, text: 1 };
      const reportDto: ReportDto = { numCommonWords: 2 };
      const report = textService.generateReport(reportDto);
      expect(report).toEqual([
        { word: 'this', count: 3 },
        { word: 'is', count: 2 },
      ]);
    });
  });
});
