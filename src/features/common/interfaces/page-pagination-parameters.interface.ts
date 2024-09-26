import { PageOptionsRequestDto } from '../dto/page-options-request.dto';

export interface IPagePaginationParamaters {
  pageOptionsDto: PageOptionsRequestDto;
  totalRecords: number;
}
