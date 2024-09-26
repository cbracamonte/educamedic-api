import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { AxiosError } from 'axios';

@Catch(AxiosError)
export class AxiosExceptionFilter implements ExceptionFilter {
  catch(exception: AxiosError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const code = exception.response?.status || 500;
    const data = exception.response?.data || {
      error: 'Internal server error',
      statusCode: code,
    };

    response.status(code).json(data);
  }
}
