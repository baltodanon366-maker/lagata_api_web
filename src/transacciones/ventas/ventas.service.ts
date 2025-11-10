import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Venta } from '../../database/postgresql/entities/venta.entity';
import { CreateVentaDto } from './dto';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private ventaRepository: Repository<Venta>,
    private dataSource: DataSource,
  ) {}

  async create(userId: number, createVentaDto: CreateVentaDto) {
    // Convertir detalles a JSONB
    const detallesJson = JSON.stringify(createVentaDto.detallesVenta);

    // Preparar fecha
    const fechaVenta = createVentaDto.fechaVenta 
      ? new Date(createVentaDto.fechaVenta)
      : null;

    // Llamar a la función PostgreSQL
    const result = await this.dataSource.query(
      'SELECT * FROM fn_Venta_Crear($1, $2, $3, $4::jsonb, $5, $6, $7, $8)',
      [
        createVentaDto.folio,
        userId,
        createVentaDto.metodoPago,
        detallesJson,
        createVentaDto.clienteId || null,
        createVentaDto.empleadoId || null,
        fechaVenta,
        createVentaDto.observaciones || null,
      ],
    );

    const ventaId = result[0]?.p_venta_id;
    const mensajeError = result[0]?.p_mensaje_error;

    if (ventaId === -1 || mensajeError) {
      throw new BadRequestException(
        mensajeError || 'No se pudo crear la venta',
      );
    }

    // Obtener la venta creada con detalles
    return this.findOne(ventaId);
  }

  async findOne(id: number) {
    const result = await this.dataSource.query(
      'SELECT * FROM fn_Venta_ObtenerPorId($1)',
      [id],
    );

    if (!result || result.length === 0) {
      throw new NotFoundException(`Venta con ID ${id} no encontrada`);
    }

    // Obtener detalles
    const detalles = await this.dataSource.query(
      'SELECT * FROM fn_Venta_ObtenerDetalles($1)',
      [id],
    );

    return {
      ...result[0],
      detalles,
    };
  }

  async findDetalles(id: number) {
    const detalles = await this.dataSource.query(
      'SELECT * FROM fn_Venta_ObtenerDetalles($1)',
      [id],
    );

    return detalles;
  }

  async findByRangoFechas(
    fechaInicio: string,
    fechaFin: string,
    limit: number = 100,
  ) {
    const fechaInicioDate = new Date(fechaInicio);
    const fechaFinDate = new Date(fechaFin);

    const ventas = await this.dataSource.query(
      'SELECT * FROM fn_Venta_MostrarPorRangoFechas($1, $2, $3)',
      [fechaInicioDate, fechaFinDate, limit],
    );

    return ventas;
  }
}

