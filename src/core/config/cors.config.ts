import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { registerAs } from '@nestjs/config';
const getenv = require('getenv');

export default registerAs(
  'cors',
  (): CorsOptions => ({
    origin: getenv('CORS_ORIGIN', '*'),
    credentials: getenv.bool('CORS_CREDENTIALS', true),
    exposedHeaders: getenv(
      'CORS_ALLOWED_HEADERS',
      'Accept, authorization, Authentication, Content-Type, If-None-Match, SourceType',
    ),
    methods: getenv('CORS_METHODS', 'GET,POST,PUT,DELETE'),
  }),
);
