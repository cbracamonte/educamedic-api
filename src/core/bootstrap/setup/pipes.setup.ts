import { INestApplication, ValidationPipe } from '@nestjs/common';

export async function setupGlobalPipes(app: INestApplication): Promise<void> {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
}
