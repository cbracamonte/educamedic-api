import { INestApplication } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import swaggerConfig from 'src/core/config/swagger.config';

export async function setupSwagger(app: INestApplication): Promise<void> {
  const config = app.get<ConfigType<typeof swaggerConfig>>(swaggerConfig.KEY);

  const options = new DocumentBuilder()
    .setTitle(config.title)
    .setDescription(config.description)
    .setVersion(config.version)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(config.path, app, document, {
    customSiteTitle: config.title,
  });
}
