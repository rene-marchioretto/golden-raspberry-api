import {
    ArrayNotEmpty,
    IsArray,
    IsBoolean,
    IsInt,
    IsNotEmpty,
    IsString,
    Min,
  } from 'class-validator';
  
  export class CreateMovieDto {
    @IsInt()
    @Min(0)
    year!: number;
  
    @IsString()
    @IsNotEmpty()
    title!: string;
  
    @IsString()
    @IsNotEmpty()
    studios!: string;
  
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    producers!: string[];
  
    @IsBoolean()
    winner!: boolean;
  }