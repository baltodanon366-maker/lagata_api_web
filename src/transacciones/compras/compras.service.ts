import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Compra } from '../../database/postgresql/entities/compra.entity';
import { CreateCompraDto } from './dto';

@Injectable()
export class ComprasService {
  constructor(
    @InjectRepository(Compra)
    private compraRepository: Repository<Compra>,
    private dataSource: DataSource,
  ) {}

  async create(userId: number, createCompraDto: CreateCompraDto) {
    // Convertir detalles a JSONB
    const detallesJson = JSON.stringify(createCompraDto.detallesCompra);

    // Preparar fecha
    const fechaCompra = createCompraDto.fechaCompra 
      ? new Date(createCompraDto.fechaCompra)
      : null;

    // Llamar a la función PostgreSQL
    const result = await this.dataSource.query(
      'SELECT * FROM fn_Compra_Crear($1, $2, $3, $4::jsonb, $5, $6)',
      [
        createCompraDto.folio,
        createCompraDto.proveedorId,
        userId,
        detallesJson,
        fechaCompra,
        createCompraDto.observaciones || null,
      ],
    );

    const compraId = result[0]?.p_compra_id;
    const mensajeError = result[0]?.p_mensaje_error;

    if (compraId === -1 || mensajeError) {
      throw new BadRequestException(
        mensajeError || 'No se pudo crear la compra',
      );
    }

    // Obtener la compra creada con detalles
    return this.findOne(compraId);
  }

  async findOne(id: number) {
    const result = await this.dataSource.query(
      'SELECT * FROM fn_Compra_ObtenerPorId($1)',
      [id],
    );

    if (!result || result.length === 0) {
      throw new NotFoundException(`Compra con ID ${id} no encontrada`);
    }

    // Obtener detalles
    const detalles = await this.dataSource.query(
      'SELECT * FROM fn_Compra_ObtenerDetalles($1)',
      [id],
    );

    return {
      ...result[0],
      detalles,
    };
  }

  async findDetalles(id: number) {
    const detalles = await this.dataSource.query(
      'SELECT * FROM fn_Compra_ObtenerDetalles($1)',
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

    const compras = await this.dataSource.query(
      'SELECT * FROM fn_Compra_MostrarPorRangoFechas($1, $2, $3)',
      [fechaInicioDate, fechaFinDate, limit],
    );

    return compras;
  }
}

