import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsString, IsUrl } from 'class-validator';
import { CoursesStatusType } from '../enums/courses.enum';
import { TFacebookData } from '../types/course.types';
import { ICategory } from '../../categories/interfaces/category.interface';
import { ICourseMode } from '../../courses-mode/interfaces/courses-mode.interface';
import { IInstructor } from '../../instructors/interfaces/instructors.interface';
import { ISponsor } from '../../sponsors/interfaces/sponsor.interface';
import { ICourseReaction } from '../../courses-reaction/interfaces/courses-recation.interface';
import { ICourseRating } from '../../courses-rating/interfaces/courses-rating.interface';

export class GetCoursesResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the course',
    example: '5f8d0d55b54764421b7156c3',
  })
  readonly id: string;

  @ApiProperty({
    description: 'Unique identifier(UUID) of the course',
    example: 'd68b12d4-c995-46f0-b2b9-f2cf261fe472',
  })
  readonly uuid: string;

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
    description: 'List of categories associated with the course',
    type: [],
  })
  @IsArray()
  readonly categories: ICategory[];

  @ApiProperty({
    description: 'List of course modes associated with the course',
  })
  @IsArray()
  readonly courseModes: ICourseMode[];

  @ApiProperty({
    description: 'List of instructors associated with the course',
  })
  @IsArray()
  readonly instructors: IInstructor[];

  @ApiProperty({
    description: 'List of sponsors associated with the course',
  })
  @IsArray()
  readonly sponsors: ISponsor[];

  @ApiProperty({
    description: 'List of course reactions associated with the course',
  })
  @IsArray()
  readonly courseReactions: ICourseReaction[];

  @ApiProperty({
    description: 'List of course ratings associated with the course',
  })
  @IsArray()
  readonly courseRatings: ICourseRating[];

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

  @ApiProperty({
    description: 'Image URL of the course',
    example: 'https://via.placeholder.com/300x200?text=Curso+1',
  })
  @IsUrl()
  readonly imageUrl: string;
  @ApiProperty({
    description: 'Average Rating',
    example: '5',
  })
  @IsUrl()
  readonly averageRating: number;
}
