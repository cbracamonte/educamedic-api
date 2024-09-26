import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class PageOptionsRequestDto {
  @ApiProperty({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly page: number;

  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly sort?: string;

  @ApiProperty({
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  readonly limit: number = 10;

  public static skip(page: number, limit: number): number {
    return (page - 1) * limit;
  }
}

export class PageOptionsRequestDtoExt extends PageOptionsRequestDto {
  @ApiPropertyOptional({
    description: 'Search keyword to filter results',
    example: 'Introduction to Angular',
  })
  @IsOptional()
  @IsString()
  readonly search?: string;

  @ApiPropertyOptional({
    description: 'Status of the course',
    example: 'active',
  })
  @IsOptional()
  @IsString()
  readonly status?: string;

  @ApiPropertyOptional({
    description: 'ID of the category',
    example: '5f8d0d55b54764421b7156c3',
  })
  @IsOptional()
  readonly categoryId?: string;

  @ApiPropertyOptional({
    description: 'ID of the course mode',
    example: '2c9c8b90b54764421b71a7d3',
  })
  @IsOptional()
  readonly courseModeId?: string;

  @ApiPropertyOptional({
    description: 'ID of the instructor',
    example: '7c9c8b90b54764421b71a8e4',
  })
  @IsOptional()
  readonly instructorId?: string;

  @ApiPropertyOptional({
    description: 'ID of the sponsor',
    example: '4f9c8b90b54764421b71a9f5',
  })
  @IsOptional()
  readonly sponsorId?: string;
}
