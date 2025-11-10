import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectDataSource('datawarehouse')
    private dataWarehouseDataSource: DataSource,
  ) {}

  // ========== VENTAS ==========
  async ventasPorRangoFechas(
    fechaInicio: string,
    fechaFin: string,
    agruparPor: string = 'Dia',
  ) {
    const fechaInicioDate = new Date(fechaInicio);
    const fechaFinDate = new Date(fechaFin);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const ventas = await this.dataWarehouseDataSource.query(
      'SELECT * FROM fn_DW_Ventas_PorRangoFechas($1, $2, $3)',
      [fechaInicioDate, fechaFinDate, agruparPor],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return ventas;
  }

  async ventasPorProducto(
    fechaInicio?: string,
    fechaFin?: string,
    top: number = 10,
  ) {
    const fechaInicioDate = fechaInicio ? new Date(fechaInicio) : null;
    const fechaFinDate = fechaFin ? new Date(fechaFin) : null;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const ventas = await this.dataWarehouseDataSource.query(
      'SELECT * FROM fn_DW_Ventas_PorProducto($1, $2, $3)',
      [fechaInicioDate, fechaFinDate, top],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return ventas;
  }

  async ventasPorCategoria(
    fechaInicio?: string,
    fechaFin?: string,
    top: number = 10,
  ) {
    const fechaInicioDate = fechaInicio ? new Date(fechaInicio) : null;
    const fechaFinDate = fechaFin ? new Date(fechaFin) : null;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const ventas = await this.dataWarehouseDataSource.query(
      'SELECT * FROM fn_DW_Ventas_PorCategoria($1, $2, $3)',
      [fechaInicioDate, fechaFinDate, top],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return ventas;
  }

  async ventasPorCliente(
    fechaInicio?: string,
    fechaFin?: string,
    top: number = 10,
  ) {
    const fechaInicioDate = fechaInicio ? new Date(fechaInicio) : null;
    const fechaFinDate = fechaFin ? new Date(fechaFin) : null;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const ventas = await this.dataWarehouseDataSource.query(
      'SELECT * FROM fn_DW_Ventas_PorCliente($1, $2, $3)',
      [fechaInicioDate, fechaFinDate, top],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return ventas;
  }

  async ventasPorEmpleado(
    fechaInicio?: string,
    fechaFin?: string,
    top: number = 10,
  ) {
    const fechaInicioDate = fechaInicio ? new Date(fechaInicio) : null;
    const fechaFinDate = fechaFin ? new Date(fechaFin) : null;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const ventas = await this.dataWarehouseDataSource.query(
      'SELECT * FROM fn_DW_Ventas_PorEmpleado($1, $2, $3)',
      [fechaInicioDate, fechaFinDate, top],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return ventas;
  }

  async ventasPorMetodoPago(fechaInicio?: string, fechaFin?: string) {
    const fechaInicioDate = fechaInicio ? new Date(fechaInicio) : null;
    const fechaFinDate = fechaFin ? new Date(fechaFin) : null;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const ventas = await this.dataWarehouseDataSource.query(
      'SELECT * FROM fn_DW_Ventas_MetodoPago($1, $2)',
      [fechaInicioDate, fechaFinDate],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return ventas;
  }

  // ========== COMPRAS ==========
  async comprasPorRangoFechas(
    fechaInicio: string,
    fechaFin: string,
    agruparPor: string = 'Dia',
  ) {
    const fechaInicioDate = new Date(fechaInicio);
    const fechaFinDate = new Date(fechaFin);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const compras = await this.dataWarehouseDataSource.query(
      'SELECT * FROM fn_DW_Compras_PorRangoFechas($1, $2, $3)',
      [fechaInicioDate, fechaFinDate, agruparPor],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return compras;
  }

  async comprasPorProveedor(
    fechaInicio?: string,
    fechaFin?: string,
    top: number = 10,
  ) {
    const fechaInicioDate = fechaInicio ? new Date(fechaInicio) : null;
    const fechaFinDate = fechaFin ? new Date(fechaFin) : null;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const compras = await this.dataWarehouseDataSource.query(
      'SELECT * FROM fn_DW_Compras_PorProveedor($1, $2, $3)',
      [fechaInicioDate, fechaFinDate, top],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return compras;
  }

  async comprasPorProducto(
    fechaInicio?: string,
    fechaFin?: string,
    top: number = 10,
  ) {
    const fechaInicioDate = fechaInicio ? new Date(fechaInicio) : null;
    const fechaFinDate = fechaFin ? new Date(fechaFin) : null;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const compras = await this.dataWarehouseDataSource.query(
      'SELECT * FROM fn_DW_Compras_PorProducto($1, $2, $3)',
      [fechaInicioDate, fechaFinDate, top],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return compras;
  }

  // ========== INVENTARIO ==========
  async inventarioStockActual() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const inventario = await this.dataWarehouseDataSource.query(
      'SELECT * FROM fn_DW_Inventario_StockActual()',
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return inventario;
  }

  async inventarioProductosStockBajo() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const productos = await this.dataWarehouseDataSource.query(
      'SELECT * FROM fn_DW_Inventario_ProductosStockBajo()',
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return productos;
  }

  async inventarioValorInventario() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const valor = await this.dataWarehouseDataSource.query(
      'SELECT * FROM fn_DW_Inventario_ValorInventario()',
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return valor;
  }

  // ========== MÉTRICAS Y KPIs ==========
  async metricasDashboard(fechaInicio?: string, fechaFin?: string) {
    const fechaInicioDate = fechaInicio ? new Date(fechaInicio) : null;
    const fechaFinDate = fechaFin ? new Date(fechaFin) : null;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const metricas = await this.dataWarehouseDataSource.query(
      'SELECT * FROM fn_DW_Metricas_Dashboard($1, $2)',
      [fechaInicioDate, fechaFinDate],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return metricas;
  }

  async metricasTendencias(
    periodoActualInicio: string,
    periodoActualFin: string,
    periodoAnteriorInicio: string,
    periodoAnteriorFin: string,
  ) {
    const paInicio = new Date(periodoActualInicio);
    const paFin = new Date(periodoActualFin);
    const panInicio = new Date(periodoAnteriorInicio);
    const panFin = new Date(periodoAnteriorFin);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const tendencias = await this.dataWarehouseDataSource.query(
      'SELECT * FROM fn_DW_Metricas_Tendencias($1, $2, $3, $4)',
      [paInicio, paFin, panInicio, panFin],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return tendencias;
  }

  async metricasProductosMasVendidos(
    fechaInicio?: string,
    fechaFin?: string,
    top: number = 10,
  ) {
    const fechaInicioDate = fechaInicio ? new Date(fechaInicio) : null;
    const fechaFinDate = fechaFin ? new Date(fechaFin) : null;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const productos = await this.dataWarehouseDataSource.query(
      'SELECT * FROM fn_DW_Metricas_ProductosMasVendidos($1, $2, $3)',
      [fechaInicioDate, fechaFinDate, top],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return productos;
  }

  async metricasClientesMasFrecuentes(
    fechaInicio?: string,
    fechaFin?: string,
    top: number = 10,
  ) {
    const fechaInicioDate = fechaInicio ? new Date(fechaInicio) : null;
    const fechaFinDate = fechaFin ? new Date(fechaFin) : null;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const clientes = await this.dataWarehouseDataSource.query(
      'SELECT * FROM fn_DW_Metricas_ClientesMasFrecuentes($1, $2, $3)',
      [fechaInicioDate, fechaFinDate, top],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return clientes;
  }

  // ========== REPORTES AVANZADOS ==========
  async reporteVentasVsCompras(fechaInicio: string, fechaFin: string) {
    const fechaInicioDate = new Date(fechaInicio);
    const fechaFinDate = new Date(fechaFin);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const reporte = await this.dataWarehouseDataSource.query(
      'SELECT * FROM fn_DW_Reporte_VentasVsCompras($1, $2)',
      [fechaInicioDate, fechaFinDate],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return reporte;
  }

  async reporteRotacionInventario(
    fechaInicio: string,
    fechaFin: string,
    top: number = 10,
  ) {
    const fechaInicioDate = new Date(fechaInicio);
    const fechaFinDate = new Date(fechaFin);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const rotacion = await this.dataWarehouseDataSource.query(
      'SELECT * FROM fn_DW_Reporte_RotacionInventario($1, $2, $3)',
      [fechaInicioDate, fechaFinDate, top],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return rotacion;
  }
}
