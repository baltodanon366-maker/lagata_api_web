import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import {
  AnalyticsVentasController,
  AnalyticsComprasController,
  AnalyticsInventarioController,
  AnalyticsMetricasController,
  AnalyticsReportesController,
} from './analytics.controller';

@Module({
  imports: [
    // No necesitamos entidades para Analytics, solo la conexión al DataWarehouse
    // La conexión ya está configurada en DatabaseModule con el nombre 'datawarehouse'
  ],
  controllers: [
    AnalyticsVentasController,
    AnalyticsComprasController,
    AnalyticsInventarioController,
    AnalyticsMetricasController,
    AnalyticsReportesController,
  ],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
