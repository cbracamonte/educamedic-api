import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ConflictException,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiProperty,
} from '@nestjs/swagger';
import { CoursesService } from '../services/courses.service';
import { PageOptionsRequestDtoExt } from 'src/features/common/dto/page-options-request.dto';
import { PageDto } from 'src/features/common/dto/page.dto';
import { GetCoursesResponseDto } from '../dto/get-courses.dto';
import { CreateCourseDto } from '../dto/create-course.dto';
import { ICourses } from '../interfaces/courses.interface';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all courses' })
  @ApiResponse({
    status: 200,
    description: 'Return all courses.',
    type: PageDto<GetCoursesResponseDto>,
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  @ApiQuery({ name: 'courseModeId', required: false, type: String })
  @ApiQuery({ name: 'instructorId', required: false, type: String })
  @ApiQuery({ name: 'sponsorId', required: false, type: String })
  async getCourses(
    @Query() queryParams: PageOptionsRequestDtoExt,
  ): Promise<PageDto<GetCoursesResponseDto>> {
    return this.coursesService.getCourses(queryParams);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new course' })
  @ApiProperty({
    type: CreateCourseDto,
  })
  @ApiResponse({
    status: 201,
    description: 'The course has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 500, description: 'Internal Error' })
  @ApiResponse({ status: 409, description: 'Course already exists' })
  async create(@Body() createCourseDto: ICourses): Promise<CreateCourseDto> {
    if (
      (await this.coursesService.getCourseByName(createCourseDto.name)) !== null
    ) {
      throw new ConflictException(
        `Course with name ${createCourseDto.name} already exists`,
      );
    }
    return this.coursesService.createCourse(createCourseDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a course by ID' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the course.',
    type: GetCoursesResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  async getCourseDetail(
    @Param('id') id: string,
  ): Promise<GetCoursesResponseDto> {
    const result = await this.coursesService.getCourses(
      {
        limit: 1,
        page: 1,
      },
      [id],
    );
    const course = result.data;

    if (!course || !course.length) {
      throw new NotFoundException('Course not found');
    }
    return course[0];
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a course by UUID' })
  @ApiParam({
    name: 'id',
    description: 'Course UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Return the updated course.',
    type: GetCoursesResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  async updateCourse(@Param('id') uuid: string, @Body() payload: ICourses) {
    const result = await this.coursesService.updateCourse(uuid, payload);
    if (!result) {
      throw new NotFoundException('Course not found');
    }
    return result;
  }
}
