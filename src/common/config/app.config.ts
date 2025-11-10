import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  // Render usa el puerto desde la variable de entorno PORT (por defecto 10000)
  // En desarrollo local usa 3000
  port: parseInt(process.env.PORT || '3000', 10),
  corsOrigin: process.env.CORS_ORIGIN || '*',
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL || '60000', 10), // 1 minuto por defecto
    limit: parseInt(process.env.THROTTLE_LIMIT || '100', 10), // 100 requests por minuto por defecto
  },
}));


