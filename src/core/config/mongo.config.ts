import { registerAs } from '@nestjs/config';
const getenv = require('getenv');

export default registerAs('mongodb', () => ({
  uri: getenv('MONGODB_URI'),
  appName: getenv('MONGODB_APP_NAME'),
  options: {
    ...(getenv('NODE_ENV') !== 'local'
      ? {
          ssl: true,
          sslValidate: true,
          sslCA: getenv('MONGO_SSL_CRT_PATH'),
        }
      : {}),
  },
}));
