import { registerAs } from '@nestjs/config';
const getenv = require('getenv');

export interface AppConfig {
  env: string;
  host: string;
  port: number;
  swaggerHost: string;
  baseUri: string;
  jwtSecret: string;
  corsOrigin: string;
  corsMethods: string;
  corsAllowedHeaders: string;
  swaggerAppName: string;
  swaggerAppVersion: string;
  swaggerAppDescription: string;
  mongodbAppName:string;
  mongodbUri: string;
}

export default registerAs(
  'app',
  (): AppConfig => ({
    env: getenv('NODE_ENV'),
    host: getenv('APP_HOST', ''),
    port: getenv.int('APP_PORT', 3000),
    swaggerHost: getenv('SWAGGER_APP_HOST', ''),
    baseUri: getenv('APP_BASE_URL', ''),
    jwtSecret: getenv('AUTHENTICATION_JWT_SECRET'),
    corsOrigin: getenv('CORS_ORIGIN', '*'),
    corsMethods: getenv('CORS_METHODS', 'GET,POST,PUT,DELETE,OPTIONS'),
    corsAllowedHeaders: getenv(
      'CORS_ALLOWED_HEADERS',
      'Accept, authorization, Authentication, Content-Type, If-None-Match, SourceType',
    ),
    swaggerAppName: getenv('SWAGGER_APP_NAME', 'Educamedic API'),
    swaggerAppVersion: getenv('SWAGGER_APP_VERSION', '1.0'),
    swaggerAppDescription: getenv(
      'SWAGGER_APP_DESCRIPTION',
      'API for Educamedic project',
    ),
    mongodbAppName: getenv('MONGODB_APP_NAME'),
    mongodbUri: getenv('MONGODB_URI'),
  }),
);
