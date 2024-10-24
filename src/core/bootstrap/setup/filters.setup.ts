import { INestApplication } from '@nestjs/common';
import { AxiosExceptionFilter } from '../../../features/shared/middleware/errors/axios-exception.filter';


export async function setupGlobalFilters(app: INestApplication): Promise<void> {
  app.useGlobalFilters(new AxiosExceptionFilter());
}
