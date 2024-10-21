import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsEnum, IsOptional, IsArray, IsUrl, ValidateNested, IsUUID } from 'class-validator';
import { HydratedDocument } from 'mongoose';
import { CoursesStatusType } from '../enums/courses.enum';
import { TFacebookData } from '../types/course.types';
import { ICourses } from '../interfaces/courses.interface';

@Schema({
  collection: 'courses',
})
export class Courses implements ICourses {
  @ApiProperty({
    description: 'Unique identifier for the course',
    example: '64f4b123f8253a7c6bcf1d8f',
  })
  @Prop()
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({
    description: 'Unique identifier (UUID) for the course',
    example: '1f9a2f3d-de72-4c1b-8e63-690ccc64a30e',
  })
  @Prop()
  @IsOptional()
  @IsUUID()
  uuid: string;

  @ApiProperty({
    description: 'Name of the course',
    example: 'Instrumentación Quirúrgica y Central de Esterilización',
  })
  @Prop({ required: true })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Brief description of the course',
    example: 'Curso de instrumentación quirúrgica y central de esterilización.',
  })
  @Prop({ required: true })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Start date of the course',
    example: '2024-03-01T00:00:00Z',
  })
  @Prop({ required: true })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'End date of the course',
    example: '2024-06-01T00:00:00Z',
  })
  @Prop({ required: true })
  @IsDateString()
  endDate: string;

  @ApiProperty({
    description: 'Start hour of the course',
    example: '09:00 am',
  })
  @Prop({ required: true })
  @IsString()
  startHour: string;

  @ApiProperty({
    description: 'End hour of the course',
    example: '11:00 pm',
  })
  @Prop({ required: true })
  @IsString()
  endHour: string;

  @ApiProperty({
    description: 'Duration of the course in hours',
    example: '2 horas',
  })
  @Prop({ required: true })
  @IsString()
  duration: string;

  @ApiProperty({
    description: 'Status of the course (Active or Inactive)',
    example: 'Active',
  })
  @Prop({ required: true, enum: CoursesStatusType })
  @IsEnum(CoursesStatusType)
  status: CoursesStatusType;

  @ApiProperty({
    description: 'Publication date of the course',
    example: '2024-01-20T12:00:00Z',
  })
  @Prop({ required: true })
  @IsDateString()
  publicationDate: string;

  @ApiProperty({
    description: 'Creation date of the course',
    example: '2024-01-15T12:00:00Z',
  })
  @Prop({ required: true })
  @IsDateString()
  createdDate: string;

  @ApiProperty({
    description: 'Update date of the course',
    example: '2024-01-15T12:00:00Z',
  })
  @Prop({ required: true })
  @IsDateString()
  updatedDate: string;

  @ApiProperty({
    description: 'Category UUIDs associated with the course',
    example: ['enfermeria'],
  })
  @Prop({ type: [String], required: true })
  @IsArray()
  @IsString({ each: true })
  categoryUuids: string[];

  @ApiProperty({
    description: 'Course mode UUIDs',
    example: ['modeAsync'],
  })
  @Prop({ type: [String], required: true })
  @IsArray()
  @IsString({ each: true })
  courseModeUuids: string[];

  @ApiProperty({
    description: 'Instructor UUIDs associated with the course',
    example: ['janeSmith'],
  })
  @Prop({ type: [String], required: true })
  @IsArray()
  @IsString({ each: true })
  instructorUuids: string[];

  @ApiProperty({
    description: 'Sponsor UUIDs associated with the course',
    example: ['techCorp'],
  })
  @Prop({ type: [String], required: true })
  @IsArray()
  @IsString({ each: true })
  sponsorUuids: string[];

  @ApiProperty({
    description: 'Course reactions UUIDs',
    example: ['reactionUUID1'],
  })
  @Prop({ type: [String], required: true })
  @IsArray()
  @IsString({ each: true })
  courseReactionsUuids: string[];

  @ApiProperty({
    description: 'Course ratings UUIDs',
    example: ['ratingUUID1'],
  })
  @Prop({ type: [String], required: true })
  @IsArray()
  @IsString({ each: true })
  courseRatingsUuids: string[];

  @ApiProperty({
    description: 'URL to the online meeting',
    example: 'https://meet.google.com/abc-123',
  })
  @Prop({ required: true })
  @IsUrl()
  urlMeeting: string;

  @ApiProperty({
    description: 'Facebook data related to the course',
    example: {
      pageId: '123456789',
      pageName: 'CoursePage',
      eventUrl: 'https://www.facebook.com/events/1234567890',
    },
  })
  @Prop({ type: Object, required: true })
  @ValidateNested()
  facebookData: TFacebookData;

  @ApiProperty({
    description: 'URL of the course image',
    example: 'https://example.com/image.png',
  })
  @Prop({ required: true })
  @IsUrl()
  imageUrl: string;
}

export type CoursesDocument = HydratedDocument<ICourses>;
export const CoursesSchema = SchemaFactory.createForClass(Courses);