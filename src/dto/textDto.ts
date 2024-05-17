import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class ReportDto {
  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @IsNumber()
  numCommonWords?: number;
}
