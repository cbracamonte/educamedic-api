import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Courses, CoursesDocument } from '../schemas/courses.schema';
import { HydratedDocument, Model, PipelineStage, SortOrder } from 'mongoose';
import { PageOptionsRequestDtoExt } from 'src/features/common/dto/page-options-request.dto';
import { Dictionary } from 'src/features/shared/types/dictionary.interface';
import { GetCoursesResponseDto } from '../dto/get-courses.dto';
import { ICourses } from '../interfaces/courses.interface';
import { PagePaginationResponseDto } from 'src/features/common/dto/page-pagination-response.dto';
import { PageDto } from 'src/features/common/dto/page.dto';
import { CreateCourseDto } from '../dto/create-course.dto';
import { v4 as uuidV4 } from 'uuid';

const sortingDictionary: Dictionary<string> = {
  createdDate: 'createdDate',
};

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Courses.name) private readonly model: Model<Courses>,
  ) {}

  async getCourses(
    pageOptionsRequestDto: PageOptionsRequestDtoExt,
    courseUuid?: string[],
  ): Promise<PageDto<GetCoursesResponseDto>> {
    try {
      let coursesModel: ICourses[] = [];
      const {
        limit,
        page,
        search,
        status,
        sort = '-createdDate',
        categoryId,
        courseModeId,
        instructorId,
        sponsorId,
      } = pageOptionsRequestDto;

      const coursesAggregationPipeline = this.buildAggregationPipeline();

      if (courseUuid) {
        coursesAggregationPipeline.push({
          $match: {
            uuid: { $in: courseUuid },
          },
        });
      }

      if (search) {
        coursesAggregationPipeline.push({
          $match: {
            $text: { $search: search },
          },
        });
      }

      if (status) {
        coursesAggregationPipeline.push({
          $match: {
            status,
          },
        });
      }

      if (categoryId) {
        coursesAggregationPipeline.push({
          $match: {
            categoryId,
          },
        });
      }

      if (courseModeId) {
        coursesAggregationPipeline.push({
          $match: {
            courseModeId,
          },
        });
      }

      if (instructorId) {
        coursesAggregationPipeline.push({
          $match: {
            instructorId,
          },
        });
      }

      if (sponsorId) {
        coursesAggregationPipeline.push({
          $match: {
            sponsorId,
          },
        });
      }

      const sorting: { [key: string]: SortOrder } = {};
      sort.split(',').forEach((_field) => {
        const order = _field.startsWith('-') ? -1 : 1;
        const field = _field.replace('-', '');
        if (sortingDictionary.hasOwnProperty(field)) {
          sorting[sortingDictionary[field]] = order;
        }
      });

      coursesModel =
        !!page && !!limit
          ? await this.model
              .aggregate(coursesAggregationPipeline)
              .sort(sorting)
              .skip(PageOptionsRequestDtoExt.skip(page, limit))
              .limit(limit * 1)
          : await this.model.aggregate(coursesAggregationPipeline).exec();

      const coursesResponseDto: GetCoursesResponseDto[] = coursesModel.map(
        (course: ICourses) => {
          return {
            id: course._id,
            uuid: course.uuid,
            name: course.name,
            description: course.description,
            startDate: course.startDate,
            endDate: course.endDate,
            startHour: course.startHour,
            endHour: course.endHour,
            duration: course.duration,
            status: course.status,
            categoryIds: course.categoryIds,
            courseModeIds: course.courseModeIds,
            instructorIds: course.instructorIds,
            sponsorIds: course.sponsorIds,
            createdDate: course.createdDate,
            updatedDate: course.updatedDate,
            facebookData: course.facebookData,
            publicationDate: course.publicationDate,
            testiomonialIds: course.testimonialIds,
            urlMeeting: course.urlMeeting,
          };
        },
      );

      const courseRecords = await this.model
        .aggregate(coursesAggregationPipeline)
        .count('count')
        .exec();

      const pagePaginationDto = new PagePaginationResponseDto({
        totalRecords: courseRecords?.[0]?.count ?? 0,
        pageOptionsDto: pageOptionsRequestDto,
      });

      return new PageDto(coursesResponseDto, pagePaginationDto);
    } catch (e) {
      console.error(e);
    }
  }

  async createCourse(course: ICourses): Promise<CreateCourseDto> {
    const courseWithUuid = { ...course, uuid: uuidV4() };
    const courseDocument = new this.model(
      courseWithUuid,
    ) as unknown as CoursesDocument & { _id: string };
    await courseDocument.save();
    return courseDocument.toJSON() as unknown as CreateCourseDto;
  }

  async getCourseByName(name: string): Promise<GetCoursesResponseDto> {
    return this.model
      .findOne({ name }, { __v: 0 })
      .lean() as unknown as GetCoursesResponseDto;
  }

  async getById(id: string): Promise<GetCoursesResponseDto> {
    return this.model.findById(id).lean() as unknown as GetCoursesResponseDto;
  }

  async updateCourse(
    uuid: string,
    course: ICourses,
  ): Promise<GetCoursesResponseDto> {
    const courseUpdated = await this.model.findOneAndUpdate({ uuid }, course, {
      new: true,
    });

    const courseDocument =
      courseUpdated as unknown as HydratedDocument<CoursesDocument>;

    const courseResponseDto: GetCoursesResponseDto = {
      id: courseDocument._id,
      uuid: courseDocument.uuid,
      name: courseDocument.name,
      description: courseDocument.description,
      startDate: courseDocument.startDate,
      endDate: courseDocument.endDate,
      startHour: courseDocument.startHour,
      endHour: courseDocument.endHour,
      duration: courseDocument.duration,
      status: courseDocument.status,
      categoryIds: courseDocument.categoryIds,
      courseModeIds: courseDocument.courseModeIds,
      instructorIds: courseDocument.instructorIds,
      sponsorIds: courseDocument.sponsorIds,
      createdDate: courseDocument.createdDate,
      updatedDate: courseDocument.updatedDate,
      facebookData: courseDocument.facebookData,
      publicationDate: courseDocument.publicationDate,
      testiomonialIds: courseDocument.testimonialIds,
      urlMeeting: courseDocument.urlMeeting,
    };

    return courseResponseDto;
  }

  // delete(id: string): boolean {
  //   const courseIndex = this.courses.findIndex((course) => course.id === id);
  //   if (courseIndex > -1) {
  //     this.courses.splice(courseIndex, 1);
  //     return true;
  //   }
  //   return false;
  // }

  private buildAggregationPipeline(): PipelineStage[] {
    // TODO: For the future implementation of the aggregation pipeline
    return [];
  }
}
