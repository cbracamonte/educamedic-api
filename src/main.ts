import { bootstrap } from './core/bootstrap/bootstrap';

bootstrap()
  .then(() => console.info('Bootstrapped OK'))
  .catch((error) => console.error(error));
