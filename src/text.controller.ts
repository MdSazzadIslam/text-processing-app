import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TextService } from './text.service';
import { LanguageMiddleware } from './middlewares/language.middleware';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { TextDto } from './dto/textDto';
import { ReportDto } from './dto/reportDto';

@Controller({ path: 'text', version: '0.0.1' })
@UseGuards(LanguageMiddleware)
export class TextController {
  private readonly logger = new Logger(TextController.name);
  constructor(private readonly textService: TextService) {}

  @Post('process')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit Text for Processing' })
  @ApiBody({ type: TextDto, description: 'Text to be processed' })
  @ApiCreatedResponse({ description: 'Text processed successfully' })
  @ApiBadRequestResponse({
    description: 'Text is required or contains invalid characters',
  })
  submitText(@Body() textDto: TextDto): void {
    try {
      if (!textDto.text) {
        throw new BadRequestException('Text is required.');
      }

      this.textService.processText(textDto);
      this.logger.log('Text processed successfully.');
    } catch (err) {
      this.logger.error(`Error processing text: ${err.message}`);
      throw new HttpException(
        `Oops! Something unexpected happened: ${err.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('report')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Text Processing Report' })
  @ApiQuery({
    name: 'numCommonWords',
    type: Number,
    description: 'Number of common words to include in the report',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Report generated successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid numCommonWords parameter' })
  getReport(@Query() reportDto: ReportDto): { word: string; count: number }[] {
    try {
      if (reportDto.numCommonWords && isNaN(reportDto.numCommonWords)) {
        throw new BadRequestException('Invalid numCommonWords parameter.');
      }
      const report = this.textService.generateReport(reportDto);
      this.logger.log('Report generated successfully.');
      return report;
    } catch (err) {
      this.logger.error(`Error generating report: ${err.message}`);
      throw new HttpException(
        `Oops! Something unexpected happened: ${err.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
