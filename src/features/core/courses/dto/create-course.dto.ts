import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';
import { CoursesStatusType } from '../enums/courses.enum';
import { TFacebookData } from '../types/course.types';

export class CreateCourseDto {
  @ApiProperty({
    description: 'Unique identifier(UUID) of the course',
    example: '5ea4bc57-78cd-48db-ac5a-c6abfc8f0f89',
  })
  @IsString()
  @IsOptional()
  readonly uuid?: string;

  @ApiProperty({
    description: 'Name of the course',
    example: 'Introduction to Angular',
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'Brief description of the course',
    example: 'A beginner course on Angular framework.',
  })
  @IsString()
  readonly description: string;

  @ApiProperty({
    description: 'Start date of the course',
    example: '2024-09-01T09:00:00Z',
  })
  @IsDateString()
  readonly startDate: string;

  @ApiProperty({
    description: 'End date of the course',
    example: '2024-09-30T17:00:00Z',
  })
  @IsDateString()
  readonly endDate: string;

  @ApiProperty({ description: 'Start hour of the course', example: '09:00' })
  @IsString()
  readonly startHour: string;

  @ApiProperty({ description: 'End hour of the course', example: '17:00' })
  @IsString()
  readonly endHour: string;

  @ApiProperty({
    description: 'Total duration of the course',
    example: '8 hours',
  })
  @IsString()
  readonly duration: string;

  @ApiProperty({
    description: 'Status of the course',
    enum: CoursesStatusType,
    example: 'Active',
  })
  readonly status: CoursesStatusType;

  @ApiProperty({
    description: 'List of category IDs',
    example: ['5f8d0d55b54764421b7156c3', '6f9d1e66c65775532c8267d4'],
  })
  @IsArray()
  readonly categoryIds: string[];

  @ApiProperty({
    description: 'List of course mode IDs',
    example: ['5f8d0d55b54764421b7156c3'],
  })
  @IsArray()
  readonly courseModeIds: string[];

  @ApiProperty({
    description: 'List of instructor IDs',
    example: ['5f8d0d55b54764421b7156c3'],
  })
  @IsArray()
  readonly instructorIds: string[];

  @ApiProperty({
    description: 'List of sponsor IDs',
    example: ['5f8d0d55b54764421b7156c3'],
  })
  @IsArray()
  readonly sponsorIds: string[];

  @ApiProperty({
    description: 'List of testimonial IDs',
    example: ['5f8d0d55b54764421b7156c3'],
  })
  @IsArray()
  readonly testiomonialIds: string[];

  @ApiProperty({
    description: 'Facebook data associated with the course',
    example: {
      pageId: '1234567890',
      pageName: 'CoursePage',
      eventUrl: 'https://www.facebook.com/events/1234567890',
    },
  })
  readonly facebookData: TFacebookData;

  @ApiProperty({
    description: 'Creation date of the course',
    example: '2024-09-01T09:00:00Z',
  })
  @IsDateString()
  readonly createdDate: string;

  @ApiProperty({
    description: 'Last updated date of the course',
    example: '2024-09-10T17:00:00Z',
  })
  @IsDateString()
  readonly updatedDate: string;

  @ApiProperty({
    description: 'URL for the online meeting of the course',
    example: 'https://zoom.us/j/123456789',
  })
  @IsString()
  readonly urlMeeting: string;

  @ApiProperty({
    description: 'Publication date of the course',
    example: '2024-08-15T09:00:00Z',
  })
  @IsDateString()
  readonly publicationDate: string;
}
