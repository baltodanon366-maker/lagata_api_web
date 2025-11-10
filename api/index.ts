import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from '../src/app.module';
import express from 'express';
import serverless from 'serverless-http';
import { ConfigService } from '@nestjs/config';

let cachedServer: any;

async function bootstrap() {
  if (!cachedServer) {
    const expressApp = express();
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );
    
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

**Total: 118 endpoints** (MongoDB deshabilitado temporalmente)

## 🛡️ Seguridad
- Rate Limiting: 100 requests por minuto por IP
- JWT Authentication: Tokens expiran según configuración
- CORS: Configurado según variables de entorno
- Helmet: Headers de seguridad habilitados

## 📝 Notas
- Los endpoints de Analytics usan el DataWarehouse (PostgreSQL separado)
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
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

    await app.init();
    
    cachedServer = serverless(expressApp);
  }
  
  return cachedServer;
}

export default async function handler(req: any, res: any) {
  const server = await bootstrap();
  return server(req, res);
}

