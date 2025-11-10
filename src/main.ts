import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security
  app.use(helmet());
  app.use(compression());

  // CORS
  const corsOrigin = configService.get<string>('app.corsOrigin') || '*';
  app.enableCors({
    origin: corsOrigin === '*' ? true : corsOrigin.split(','),
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger/OpenAPI Documentation
  const config = new DocumentBuilder()
    .setTitle('Licoreria API - Sistema de Facturación')
    .setDescription(
      `API transaccional de facturación para una licorería desarrollada en NestJS con PostgreSQL (Supabase) y MongoDB.

## 🔐 Autenticación
Todos los endpoints requieren autenticación JWT excepto los marcados como públicos (login, register, health check).

Para usar los endpoints protegidos:
1. Obtén un token JWT usando \`POST /auth/login\`
2. Haz clic en el botón "Authorize" arriba
3. Ingresa: \`Bearer <tu-token-jwt>\`

## 📊 Endpoints Disponibles
- **Autenticación**: 7 endpoints (login, register, cambio de contraseña, perfil, permisos, roles)
- **Catálogos**: 80 endpoints (8 módulos × 10 endpoints cada uno)
- **Transacciones**: 13 endpoints (Compras, Ventas, Devoluciones, Movimientos Stock)
- **Analytics**: 18 endpoints (DataWarehouse - Ventas, Compras, Inventario, Métricas, Reportes)
- **MongoDB**: 12 endpoints (Notificaciones y Logs)

**Total: 130 endpoints**

## 🛡️ Seguridad
- Rate Limiting: 100 requests por minuto por IP
- JWT Authentication: Tokens expiran según configuración
- CORS: Configurado según variables de entorno
- Helmet: Headers de seguridad habilitados

## 📝 Notas
- Los endpoints de Analytics usan el DataWarehouse (PostgreSQL separado)
- Los endpoints de MongoDB requieren configuración de MongoDB Atlas
- Todas las respuestas están en formato JSON
- Los errores siguen el formato estándar HTTP`,
    )
    .setVersion('1.0')
    .setContact(
      'Licoreria La Gata',
      'https://licoreria-lagata.com',
      'support@licoreria-lagata.com',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    // Los tags se generan automáticamente desde los @ApiTags() de los controladores
    // No es necesario definirlos aquí manualmente para evitar duplicados
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = configService.get<number>('app.port') || 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api`);
}

void bootstrap();
