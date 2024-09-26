import { IPagePaginationParamaters } from '../interfaces/page-pagination-parameters.interface';

export class PagePaginationResponseDto {
  readonly totalRecords: number;
  readonly currentPage: number;
  readonly totalPages: number;
  readonly nextPage: number;
  readonly previousPage: number;

  constructor({ pageOptionsDto, totalRecords }: IPagePaginationParamaters) {
    this.totalRecords = totalRecords;
    this.currentPage = pageOptionsDto.page * 1;
    this.totalPages = Math.ceil(totalRecords / pageOptionsDto.limit);
    this.previousPage = this.currentPage > 1 ? this.currentPage - 1 : null;
    this.nextPage =
      this.currentPage < this.totalPages ? this.currentPage + 1 : null;
  }
}
