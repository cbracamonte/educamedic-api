import { registerAs } from '@nestjs/config';
const getenv = require('getenv');

export default registerAs('mongodb', () => ({
  uri: getenv('MONGODB_URI'),
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
