import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './common/config/app.config';
import { getThrottlerConfig } from './common/config/throttler.config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { CategoriasModule } from './catalogos/categorias/categorias.module';
import { MarcasModule } from './catalogos/marcas/marcas.module';
import { ModelosModule } from './catalogos/modelos/modelos.module';
import { ProductosModule } from './catalogos/productos/productos.module';
import { ProveedoresModule } from './catalogos/proveedores/proveedores.module';
import { ClientesModule } from './catalogos/clientes/clientes.module';
import { EmpleadosModule } from './catalogos/empleados/empleados.module';
import { DetalleProductoModule } from './catalogos/detalle-producto/detalle-producto.module';
import { ComprasModule } from './transacciones/compras/compras.module';
import { VentasModule } from './transacciones/ventas/ventas.module';
import { DevolucionesModule } from './transacciones/devoluciones/devoluciones.module';
import { MovimientosStockModule } from './transacciones/movimientos-stock/movimientos-stock.module';
import { AnalyticsModule } from './analytics/analytics.module';
// MongoDB deshabilitado temporalmente - descomentar cuando se configure MongoDB Atlas
// import { NotificationsModule } from './mongodb/notifications/notifications.module';
// import { LogsModule } from './mongodb/logs/logs.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

// Verificar si MongoDB está configurado (deshabilitado temporalmente)
// const isMongoConfigured = () => {
//   const uri = process.env.MONGODB_URI;
//   const database = process.env.MONGODB_DATABASE;
//   return !!(uri && database);
// };

@Module({
  imports: [
    // Configuración global de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: '.env',
    }),
    // Rate Limiting (Throttler)
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getThrottlerConfig,
      inject: [ConfigService],
    }),
    // Módulo de bases de datos (PostgreSQL + MongoDB)
    DatabaseModule.forRoot(),
    // Módulo de autenticación
    AuthModule,
    // Módulos de catálogos
    CategoriasModule,
    MarcasModule,
    ModelosModule,
    ProductosModule,
    ProveedoresModule,
    ClientesModule,
    EmpleadosModule,
    DetalleProductoModule,
    // Módulos de transacciones
    ComprasModule,
    VentasModule,
    DevolucionesModule,
    MovimientosStockModule,
    // Módulo de Analytics (DataWarehouse)
    AnalyticsModule,
    // Módulos MongoDB (Notificaciones y Logs) - Deshabilitado temporalmente
    // Descomentar cuando se configure MongoDB Atlas:
    // ...(isMongoConfigured() ? [NotificationsModule, LogsModule] : []),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Guard global JWT (se puede omitir usando @Public() en rutas públicas)
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Guard global Throttler (Rate Limiting)
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
