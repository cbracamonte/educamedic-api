import { registerAs } from '@nestjs/config';
const getenv = require('getenv');

export interface SwaggerConfig {
  title: string;
  description: string;
  version: string;
  path: string;
}

export default registerAs(
  'swagger',
  (): SwaggerConfig => ({
    title: getenv('SWAGGER_APP_NAME', 'Educamedic API'),
    description: getenv(
      'SWAGGER_APP_DESCRIPTION',
      'API for Educamedic project',
    ),
    version: getenv('SWAGGER_APP_VERSION', '1.0'),
    path: getenv('SWAGGER_APP_PATH', 'api'),
  }),
);
