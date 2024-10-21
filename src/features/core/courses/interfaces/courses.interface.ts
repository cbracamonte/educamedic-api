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
  categoryUuids: string[];
  courseModeUuids: string[];
  instructorUuids: string[];
  sponsorUuids: string[];
  courseReactionsUuids: string[];
  courseRatingsUuids: string[];
  urlMeeting: string;
  facebookData: TFacebookData;
  imageUrl: string;
}
