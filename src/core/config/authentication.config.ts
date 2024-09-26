import { registerAs } from '@nestjs/config';
const getenv = require('getenv');

export interface AuthenticationConfig {
  jwtSecret: string;
}

export default registerAs(
  'authentication',
  (): AuthenticationConfig => ({
    jwtSecret: getenv('AUTHENTICATION_JWT_SECRET', ''), 
  }),
);