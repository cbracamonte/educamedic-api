import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckResult } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  @Get()
  @HealthCheck()
  checkStatus(): HealthCheckResult {
    return {
      status: 'ok',
      details: {
        health: { status: 'up' },
      },
    };
  }
}
