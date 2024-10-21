import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from '../../app.module';
import { setupSwagger } from './setup/swagger.setup';
import { setupGlobalPipes } from './setup/pipes.setup';
import { setupCors } from './setup/cors.setup';
import { setupGlobalFilters } from './setup/filters.setup';

export async function bootstrap(): Promise<any> {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>(ConfigService);
  const port = config.get<number>('APP_PORT', 3000);
  await setupSwagger(app);
  await setupGlobalPipes(app);
  await setupCors(app);
  await setupGlobalFilters(app);
  await app.listen(port, '0.0.0.0');
  console.info('Nest application is running on port:', port);
  return app;
}
