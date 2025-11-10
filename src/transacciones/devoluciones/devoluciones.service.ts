import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { DevolucionVenta } from '../../database/postgresql/entities/devolucion-venta.entity';
import { CreateDevolucionDto } from './dto';

@Injectable()
export class DevolucionesService {
  constructor(
    @InjectRepository(DevolucionVenta)
    private devolucionRepository: Repository<DevolucionVenta>,
    private dataSource: DataSource,
  ) {}

  async create(userId: number, createDevolucionDto: CreateDevolucionDto) {
    // Convertir detalles a JSONB
    const detallesJson = JSON.stringify(createDevolucionDto.detallesDevolucion);

    // Preparar fecha
    const fechaDevolucion = createDevolucionDto.fechaDevolucion 
      ? new Date(createDevolucionDto.fechaDevolucion)
      : null;

    // Llamar a la función PostgreSQL
    const result = await this.dataSource.query(
      'SELECT * FROM fn_DevolucionVenta_Crear($1, $2, $3, $4, $5::jsonb, $6, $7)',
      [
        createDevolucionDto.folio,
        createDevolucionDto.ventaId,
        userId,
        createDevolucionDto.motivo,
        detallesJson,
        fechaDevolucion,
        createDevolucionDto.observaciones || null,
      ],
    );

    const devolucionId = result[0]?.p_devolucion_venta_id;
    const mensajeError = result[0]?.p_mensaje_error;

    if (devolucionId === -1 || mensajeError) {
      throw new BadRequestException(
        mensajeError || 'No se pudo crear la devolución',
      );
    }

    // Obtener la devolución creada con detalles
    return this.findOne(devolucionId);
  }

  async findOne(id: number) {
    const result = await this.dataSource.query(
      'SELECT * FROM fn_DevolucionVenta_ObtenerPorId($1)',
      [id],
    );

    if (!result || result.length === 0) {
      throw new NotFoundException(`Devolución con ID ${id} no encontrada`);
    }

    // Obtener detalles
    const detalles = await this.dataSource.query(
      'SELECT * FROM fn_DevolucionVenta_ObtenerDetalles($1)',
      [id],
    );

    return {
      ...result[0],
      detalles,
    };
  }

  async findDetalles(id: number) {
    const detalles = await this.dataSource.query(
      'SELECT * FROM fn_DevolucionVenta_ObtenerDetalles($1)',
      [id],
    );

    return detalles;
  }
}

