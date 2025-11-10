import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { MovimientoStock } from '../../database/postgresql/entities/movimiento-stock.entity';
import { AjusteStockDto } from './dto';

@Injectable()
export class MovimientosStockService {
  constructor(
    @InjectRepository(MovimientoStock)
    private movimientoStockRepository: Repository<MovimientoStock>,
    private dataSource: DataSource,
  ) {}

  async ajusteStock(userId: number, ajusteStockDto: AjusteStockDto) {
    // Llamar a la función PostgreSQL
    const result = await this.dataSource.query(
      'SELECT * FROM fn_MovimientoStock_Ajuste($1, $2, $3, $4)',
      [
        ajusteStockDto.detalleProductoId,
        ajusteStockDto.cantidad,
        userId,
        ajusteStockDto.motivo,
      ],
    );

    const movimientoId = result[0]?.p_movimiento_stock_id;
    const mensajeError = result[0]?.p_mensaje_error;

    if (movimientoId === -1 || mensajeError) {
      throw new BadRequestException(
        mensajeError || 'No se pudo realizar el ajuste de stock',
      );
    }

    // Obtener el movimiento creado
    const movimiento = await this.movimientoStockRepository.findOne({
      where: { Id: movimientoId },
      relations: ['DetalleProducto', 'Usuario'],
    });

    if (!movimiento) {
      throw new NotFoundException('Movimiento de stock no encontrado después de crearlo');
    }

    return movimiento;
  }

  async findByProducto(
    detalleProductoId: number,
    fechaInicio?: string,
    fechaFin?: string,
    limit: number = 100,
  ) {
    const fechaInicioDate = fechaInicio ? new Date(fechaInicio) : null;
    const fechaFinDate = fechaFin ? new Date(fechaFin) : null;

    const movimientos = await this.dataSource.query(
      'SELECT * FROM fn_MovimientoStock_MostrarPorProducto($1, $2, $3, $4)',
      [detalleProductoId, fechaInicioDate, fechaFinDate, limit],
    );

    return movimientos;
  }
}

