import { ConfigService } from '@nestjs/config';
import { ThrottlerModuleOptions } from '@nestjs/throttler';

export const getThrottlerConfig = (
  configService: ConfigService,
): ThrottlerModuleOptions => {
  return {
    throttlers: [
      {
        ttl: configService.get<number>('throttle.ttl') || 60000, // 1 minuto por defecto
        limit: configService.get<number>('throttle.limit') || 100, // 100 requests por minuto por defecto
      },
    ],
  };
};

