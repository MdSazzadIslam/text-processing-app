import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TextDto {
  @ApiProperty({
    description: 'Text to be processed',
    example: 'Plek backend assignment',
  })
  @IsNotEmpty()
  @IsString()
  text: string;
}
