import { CoursesStatusType } from '../enums/courses.enum';
import { TFacebookData } from '../types/course.types';

export interface ICourses {
  _id?: string;
  uuid?: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  startHour: string;
  endHour: string;
  duration: string;
  status: CoursesStatusType;
  publicationDate: string;
  createdDate: string;
  updatedDate: string;
  categoryIds: string[];
  courseModeIds: string[];
  instructorIds: string[];
  sponsorIds: string[];
  testimonialIds: string[];
  certificateIds: string[];
  urlMeeting: string;
  facebookData: TFacebookData;
}
