import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Analytics - Ventas')
@Controller('analytics/ventas')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AnalyticsVentasController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('por-rango-fechas')
  @ApiOperation({ summary: 'Ventas agregadas por rango de fechas (Analytics)' })
  @ApiQuery({
    name: 'fechaInicio',
    required: true,
    type: String,
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'fechaFin',
    required: true,
    type: String,
    example: '2024-12-31',
  })
  @ApiQuery({
    name: 'agruparPor',
    required: false,
    enum: ['Dia', 'Semana', 'Mes', 'Año'],
    example: 'Dia',
  })
  @ApiResponse({
    status: 200,
    description: 'Ventas agregadas por rango de fechas',
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  porRangoFechas(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Query('agruparPor') agruparPor: string = 'Dia',
  ) {
    return this.analyticsService.ventasPorRangoFechas(
      fechaInicio,
      fechaFin,
      agruparPor,
    );
  }

  @Get('por-producto')
  @ApiOperation({ summary: 'Ventas por producto (Analytics)' })
  @ApiQuery({
    name: 'fechaInicio',
    required: false,
    type: String,
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'fechaFin',
    required: false,
    type: String,
    example: '2024-12-31',
  })
  @ApiQuery({ name: 'top', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Ventas por producto' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  porProducto(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('top', new ParseIntPipe({ optional: true })) top?: number,
  ) {
    return this.analyticsService.ventasPorProducto(
      fechaInicio,
      fechaFin,
      top || 10,
    );
  }

  @Get('por-categoria')
  @ApiOperation({ summary: 'Ventas por categoría (Analytics)' })
  @ApiQuery({
    name: 'fechaInicio',
    required: false,
    type: String,
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'fechaFin',
    required: false,
    type: String,
    example: '2024-12-31',
  })
  @ApiQuery({ name: 'top', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Ventas por categoría' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  porCategoria(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('top', new ParseIntPipe({ optional: true })) top?: number,
  ) {
    return this.analyticsService.ventasPorCategoria(
      fechaInicio,
      fechaFin,
      top || 10,
    );
  }

  @Get('por-cliente')
  @ApiOperation({ summary: 'Ventas por cliente (Analytics)' })
  @ApiQuery({
    name: 'fechaInicio',
    required: false,
    type: String,
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'fechaFin',
    required: false,
    type: String,
    example: '2024-12-31',
  })
  @ApiQuery({ name: 'top', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Ventas por cliente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  porCliente(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('top', new ParseIntPipe({ optional: true })) top?: number,
  ) {
    return this.analyticsService.ventasPorCliente(
      fechaInicio,
      fechaFin,
      top || 10,
    );
  }

  @Get('por-empleado')
  @ApiOperation({ summary: 'Ventas por empleado (Analytics)' })
  @ApiQuery({
    name: 'fechaInicio',
    required: false,
    type: String,
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'fechaFin',
    required: false,
    type: String,
    example: '2024-12-31',
  })
  @ApiQuery({ name: 'top', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Ventas por empleado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  porEmpleado(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('top', new ParseIntPipe({ optional: true })) top?: number,
  ) {
    return this.analyticsService.ventasPorEmpleado(
      fechaInicio,
      fechaFin,
      top || 10,
    );
  }

  @Get('por-metodo-pago')
  @ApiOperation({ summary: 'Ventas por método de pago (Analytics)' })
  @ApiQuery({
    name: 'fechaInicio',
    required: false,
    type: String,
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'fechaFin',
    required: false,
    type: String,
    example: '2024-12-31',
  })
  @ApiResponse({ status: 200, description: 'Ventas por método de pago' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  porMetodoPago(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    return this.analyticsService.ventasPorMetodoPago(fechaInicio, fechaFin);
  }
}

@ApiTags('Analytics - Compras')
@Controller('analytics/compras')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AnalyticsComprasController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('por-rango-fechas')
  @ApiOperation({
    summary: 'Compras agregadas por rango de fechas (Analytics)',
  })
  @ApiQuery({
    name: 'fechaInicio',
    required: true,
    type: String,
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'fechaFin',
    required: true,
    type: String,
    example: '2024-12-31',
  })
  @ApiQuery({
    name: 'agruparPor',
    required: false,
    enum: ['Dia', 'Semana', 'Mes', 'Año'],
    example: 'Dia',
  })
  @ApiResponse({
    status: 200,
    description: 'Compras agregadas por rango de fechas',
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  porRangoFechas(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Query('agruparPor') agruparPor: string = 'Dia',
  ) {
    return this.analyticsService.comprasPorRangoFechas(
      fechaInicio,
      fechaFin,
      agruparPor,
    );
  }

  @Get('por-proveedor')
  @ApiOperation({ summary: 'Compras por proveedor (Analytics)' })
  @ApiQuery({
    name: 'fechaInicio',
    required: false,
    type: String,
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'fechaFin',
    required: false,
    type: String,
    example: '2024-12-31',
  })
  @ApiQuery({ name: 'top', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Compras por proveedor' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  porProveedor(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('top', new ParseIntPipe({ optional: true })) top?: number,
  ) {
    return this.analyticsService.comprasPorProveedor(
      fechaInicio,
      fechaFin,
      top || 10,
    );
  }

  @Get('por-producto')
  @ApiOperation({ summary: 'Compras por producto (Analytics)' })
  @ApiQuery({
    name: 'fechaInicio',
    required: false,
    type: String,
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'fechaFin',
    required: false,
    type: String,
    example: '2024-12-31',
  })
  @ApiQuery({ name: 'top', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Compras por producto' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  porProducto(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('top', new ParseIntPipe({ optional: true })) top?: number,
  ) {
    return this.analyticsService.comprasPorProducto(
      fechaInicio,
      fechaFin,
      top || 10,
    );
  }
}

@ApiTags('Analytics - Inventario')
@Controller('analytics/inventario')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AnalyticsInventarioController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('stock-actual')
  @ApiOperation({ summary: 'Stock actual de productos (Analytics)' })
  @ApiResponse({ status: 200, description: 'Stock actual de productos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  stockActual() {
    return this.analyticsService.inventarioStockActual();
  }

  @Get('productos-stock-bajo')
  @ApiOperation({ summary: 'Productos con stock bajo (Analytics)' })
  @ApiResponse({ status: 200, description: 'Productos con stock bajo' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  productosStockBajo() {
    return this.analyticsService.inventarioProductosStockBajo();
  }

  @Get('valor-inventario')
  @ApiOperation({ summary: 'Valor total del inventario (Analytics)' })
  @ApiResponse({ status: 200, description: 'Valor total del inventario' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  valorInventario() {
    return this.analyticsService.inventarioValorInventario();
  }
}

@ApiTags('Analytics - Métricas')
@Controller('analytics/metricas')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AnalyticsMetricasController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Métricas principales para dashboard (Analytics)' })
  @ApiQuery({
    name: 'fechaInicio',
    required: false,
    type: String,
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'fechaFin',
    required: false,
    type: String,
    example: '2024-12-31',
  })
  @ApiResponse({ status: 200, description: 'Métricas del dashboard' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  dashboard(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    return this.analyticsService.metricasDashboard(fechaInicio, fechaFin);
  }

  @Get('tendencias')
  @ApiOperation({
    summary: 'Tendencias de ventas comparando períodos (Analytics)',
  })
  @ApiQuery({
    name: 'periodoActualInicio',
    required: true,
    type: String,
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'periodoActualFin',
    required: true,
    type: String,
    example: '2024-01-31',
  })
  @ApiQuery({
    name: 'periodoAnteriorInicio',
    required: true,
    type: String,
    example: '2023-12-01',
  })
  @ApiQuery({
    name: 'periodoAnteriorFin',
    required: true,
    type: String,
    example: '2023-12-31',
  })
  @ApiResponse({ status: 200, description: 'Tendencias de ventas' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  tendencias(
    @Query('periodoActualInicio') periodoActualInicio: string,
    @Query('periodoActualFin') periodoActualFin: string,
    @Query('periodoAnteriorInicio') periodoAnteriorInicio: string,
    @Query('periodoAnteriorFin') periodoAnteriorFin: string,
  ) {
    return this.analyticsService.metricasTendencias(
      periodoActualInicio,
      periodoActualFin,
      periodoAnteriorInicio,
      periodoAnteriorFin,
    );
  }

  @Get('productos-mas-vendidos')
  @ApiOperation({ summary: 'Top productos más vendidos (Analytics)' })
  @ApiQuery({
    name: 'fechaInicio',
    required: false,
    type: String,
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'fechaFin',
    required: false,
    type: String,
    example: '2024-12-31',
  })
  @ApiQuery({ name: 'top', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Top productos más vendidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  productosMasVendidos(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('top', new ParseIntPipe({ optional: true })) top?: number,
  ) {
    return this.analyticsService.metricasProductosMasVendidos(
      fechaInicio,
      fechaFin,
      top || 10,
    );
  }

  @Get('clientes-mas-frecuentes')
  @ApiOperation({ summary: 'Top clientes más frecuentes (Analytics)' })
  @ApiQuery({
    name: 'fechaInicio',
    required: false,
    type: String,
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'fechaFin',
    required: false,
    type: String,
    example: '2024-12-31',
  })
  @ApiQuery({ name: 'top', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Top clientes más frecuentes' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  clientesMasFrecuentes(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('top', new ParseIntPipe({ optional: true })) top?: number,
  ) {
    return this.analyticsService.metricasClientesMasFrecuentes(
      fechaInicio,
      fechaFin,
      top || 10,
    );
  }
}

@ApiTags('Analytics - Reportes')
@Controller('analytics/reportes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AnalyticsReportesController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('ventas-vs-compras')
  @ApiOperation({
    summary: 'Reporte comparativo de ventas vs compras (Analytics)',
  })
  @ApiQuery({
    name: 'fechaInicio',
    required: true,
    type: String,
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'fechaFin',
    required: true,
    type: String,
    example: '2024-12-31',
  })
  @ApiResponse({ status: 200, description: 'Reporte ventas vs compras' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  ventasVsCompras(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    return this.analyticsService.reporteVentasVsCompras(fechaInicio, fechaFin);
  }

  @Get('rotacion-inventario')
  @ApiOperation({ summary: 'Reporte de rotación de inventario (Analytics)' })
  @ApiQuery({
    name: 'fechaInicio',
    required: true,
    type: String,
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'fechaFin',
    required: true,
    type: String,
    example: '2024-12-31',
  })
  @ApiQuery({ name: 'top', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Reporte de rotación de inventario',
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  rotacionInventario(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Query('top', new ParseIntPipe({ optional: true })) top?: number,
  ) {
    return this.analyticsService.reporteRotacionInventario(
      fechaInicio,
      fechaFin,
      top || 10,
    );
  }
}
