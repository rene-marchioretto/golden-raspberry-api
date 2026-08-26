import { Transform } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';

export class MovieCsvRowDto {
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(0)
  year!: number;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  studios!: string;

  @Transform(({ value }) => parseProducers(String(value ?? '')))
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  producers!: string[];

  @Transform(
    ({ value }) =>
      String(value ?? '')
        .trim()
        .toLowerCase() === 'yes',
  )
  @IsBoolean()
  winner!: boolean;
}

function parseProducers(value: string): string[] {
  return value
    .replace(/\s*,\s*and\s+/gi, ', ')
    .replace(/\s+and\s+/gi, ', ')
    .split(',')
    .map((producer) => producer.trim())
    .filter(Boolean);
}
