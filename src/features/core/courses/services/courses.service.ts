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
import { ICategory } from '../../categories/interfaces/category.interface';

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

      const coursesAggregationPipeline = this.buildAggregationPipeline({
        search,
        status,
        categoryId,
        courseModeId,
        instructorId,
        sponsorId,
        courseUuid,
      });

      const sorting: { [key: string]: SortOrder } = {};
      sort.split(',').forEach((_field) => {
        const order = _field.startsWith('-') ? -1 : 1;
        const field = _field.replace('-', '');
        if (sortingDictionary.hasOwnProperty(field)) {
          sorting[sortingDictionary[field]] = order;
        }
      });

      const coursesModel = (
        !!page && !!limit
          ? await this.model
              .aggregate(coursesAggregationPipeline)
              .sort(sorting)
              .skip(PageOptionsRequestDtoExt.skip(page, limit))
              .limit(limit * 1)
          : await this.model.aggregate(coursesAggregationPipeline).exec()
      ) as ICourses[];

      const coursesResponseDto: GetCoursesResponseDto[] = this.mapToGetCoursesResponseDto(coursesModel);

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

  // async updateCourse(
  //   uuid: string,
  //   course: ICourses,
  // ): Promise<GetCoursesResponseDto> {
  //   const courseUpdated = await this.model.findOneAndUpdate({ uuid }, course, {
  //     new: true,
  //   });

  //   const courseDocument =
  //     courseUpdated as unknown as HydratedDocument<CoursesDocument>;

  //   const courseResponseDto: GetCoursesResponseDto = {
  //     id: courseDocument._id,
  //     uuid: courseDocument.uuid,
  //     name: courseDocument.name,
  //     description: courseDocument.description,
  //     startDate: courseDocument.startDate,
  //     endDate: courseDocument.endDate,
  //     startHour: courseDocument.startHour,
  //     endHour: courseDocument.endHour,
  //     duration: courseDocument.duration,
  //     status: courseDocument.status,
  //     categoryIds: courseDocument.categoryIds,
  //     courseModeIds: courseDocument.courseModeIds,
  //     instructorIds: courseDocument.instructorIds,
  //     sponsorIds: courseDocument.sponsorIds,
  //     createdDate: courseDocument.createdDate,
  //     updatedDate: courseDocument.updatedDate,
  //     facebookData: courseDocument.facebookData,
  //     publicationDate: courseDocument.publicationDate,

  //     urlMeeting: courseDocument.urlMeeting,
  //   };

  //   return courseResponseDto;
  // }

  // delete(id: string): boolean {
  //   const courseIndex = this.courses.findIndex((course) => course.id === id);
  //   if (courseIndex > -1) {
  //     this.courses.splice(courseIndex, 1);
  //     return true;
  //   }
  //   return false;
  // }

  private buildAggregationPipeline({
    search,
    status,
    categoryId,
    courseModeId,
    instructorId,
    sponsorId,
    courseUuid,
  }: {
    search?: string;
    status?: string;
    categoryId?: string;
    courseModeId?: string;
    instructorId?: string;
    sponsorId?: string;
    courseUuid?: string[];
  }): PipelineStage[] {
    const pipeline: PipelineStage[] = [];

    if (courseUuid) {
      pipeline.push({
        $match: { uuid: { $in: courseUuid } },
      });
    }

    if (search) {
      pipeline.push({
        $match: {
          $text: { $search: search },
        },
      });
    }

    if (status) {
      pipeline.push({
        $match: { status },
      });
    }

    if (categoryId) {
      pipeline.push({
        $match: { categoryUuids: categoryId },
      });
    }

    if (courseModeId) {
      pipeline.push({
        $match: { courseModeUuids: courseModeId },
      });
    }

    if (instructorId) {
      pipeline.push({
        $match: { instructorUuids: instructorId },
      });
    }

    if (sponsorId) {
      pipeline.push({
        $match: { sponsorUuids: sponsorId },
      });
    }

    pipeline.push(
      {
        $lookup: {
          from: 'courses_categories',
          localField: 'categoryUuids',
          foreignField: 'uuid',
          as: 'categoryUuids',
        },
      },
      {
        $lookup: {
          from: 'courses_mode',
          localField: 'courseModeUuids',
          foreignField: 'uuid',
          as: 'courseModeUuids',
        },
      },
      {
        $lookup: {
          from: 'instructors',
          localField: 'instructorUuids',
          foreignField: 'uuid',
          as: 'instructorUuids',
        },
      },
      {
        $lookup: {
          from: 'sponsors',
          localField: 'sponsorUuids',
          foreignField: 'uuid',
          as: 'sponsorUuids',
        },
      },
      {
        $lookup: {
          from: 'courses_reactions',
          localField: 'courseReactionsUuids',
          foreignField: 'uuid',
          as: 'courseReactionsUuids',
        },
      },
      {
        $lookup: {
          from: 'courses_ratings',
          localField: 'courseRatingsUuids',
          foreignField: 'uuid',
          as: 'courseRatingsUuids',
        },
      },
    );

    return pipeline;
  }

  private calculateAverageRating(courseRatings: any[]): number {
    if (courseRatings.length === 0) return 0;
    const totalRating = courseRatings.reduce(
      (sum, rating) => sum + rating.rating,
      0,
    );
    return totalRating / courseRatings.length;
  }

  private mapToGetCoursesResponseDto(coursesModel: ICourses[]): GetCoursesResponseDto[] {
    return coursesModel.map(
      (course) => {
        const averageRating = this.calculateAverageRating(
          course.courseRatingsUuids,
        );

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
          categories: course.categoryUuids.map((category:any) => ({
            uuid: category.uuid,
            name: category.name,
            description: category.description,
          })),
          courseModes: course.courseModeUuids.map((courseMode:any) => ({
            uuid: courseMode.uuid,
            name: courseMode.name,
            description: courseMode.description,
          })),
          instructors: course.instructorUuids.map((instructor:any) => ({
            uuid: instructor.uuid,
            name: instructor.name,
            lastName: instructor.lastName,
            grado: instructor.grado,
            profession: instructor.profession,
            description: instructor.description,
            email: instructor.email,
            phone: instructor.phone,
            address: instructor.address,
            yearsOfExperience: instructor.yearsOfExperience,
            specialization: instructor.specialization,
            certifications: instructor.certifications,
            education: instructor.education,
            languages: instructor.languages,
          })),
          sponsors: course.sponsorUuids.map((sponsor:any) => ({
            uuid: sponsor.uuid,
            name: sponsor.name,
            logoUrl: sponsor.logoUrl,
            description: sponsor.description,
            websiteUrl: sponsor.websiteUrl,
          })),
          courseReactions: course.courseReactionsUuids.map((reaction:any) => ({
            uuid: reaction.uuid,
            courseUuid: reaction.courseUuid,
            userUuid: reaction.userUuid,
            reaction: reaction.reaction,
            comment: reaction.comment,
            createdAt: reaction.createdAt,
          })),
          courseRatings: course.courseRatingsUuids.map((rating:any) => ({
            uuid: rating.uuid,
            courseUuid: rating.courseUuid,
            userUuid: rating.userUuid,
            rating: rating.rating,
            createdAt: rating.createdAt,
          })),
          averageRating,
          facebookData: course.facebookData,
          publicationDate: course.publicationDate,
          urlMeeting: course.urlMeeting,
          imageUrl: course.imageUrl,
          createdDate: course.createdDate,
          updatedDate: course.updatedDate,
        };
      },
    );
  }
}
