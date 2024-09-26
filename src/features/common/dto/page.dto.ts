import { ApiProperty } from '@nestjs/swagger';
import { PagePaginationResponseDto } from './page-pagination-response.dto';

export class PageDto<T> {
  @ApiProperty({
    description: 'The data items for the current page',
    type: 'array',
  })
  readonly data: T[];

  @ApiProperty({
    description: 'Pagination information for the current page',
    type: PagePaginationResponseDto,
    example: {
      totalRecords: 100,
      currentPage: 1,
      totalPages: 10,
      nextPage: 2,
      previousPage: null,
    },
  })
  readonly pagination: PagePaginationResponseDto;

  constructor(data: T[], pagination: PagePaginationResponseDto) {
    this.data = data;
    this.pagination = pagination;
  }
}
