import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { DetalleProducto } from '../../database/postgresql/entities/detalle-producto.entity';
import { CreateDetalleProductoDto, UpdateDetalleProductoDto } from './dto';

@Injectable()
export class DetalleProductoService {
  constructor(
    @InjectRepository(DetalleProducto)
    private detalleProductoRepository: Repository<DetalleProducto>,
    private dataSource: DataSource,
  ) {}

  async create(createDetalleProductoDto: CreateDetalleProductoDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_DetalleProducto_Crear($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
      [
        createDetalleProductoDto.productoId,
        createDetalleProductoDto.categoriaId,
        createDetalleProductoDto.marcaId,
        createDetalleProductoDto.modeloId,
        createDetalleProductoDto.codigo,
        createDetalleProductoDto.precioCompra,
        createDetalleProductoDto.precioVenta,
        createDetalleProductoDto.sku || null,
        createDetalleProductoDto.observaciones || null,
        createDetalleProductoDto.stockMinimo || 0,
        createDetalleProductoDto.unidadMedida || null,
      ],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const detalleProductoId = result[0]?.p_detalle_producto_id;

    if (detalleProductoId === -1) {
      throw new ConflictException(
        'Ya existe un detalle producto con ese código',
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const detalleProducto = await this.dataSource.query(
      'SELECT * FROM fn_DetalleProducto_MostrarActivosPorId($1)',
      [detalleProductoId],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return detalleProducto[0];
  }

  async findAll(limit: number = 100) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const detallesProducto = await this.dataSource.query(
      'SELECT * FROM fn_DetalleProducto_MostrarActivos($1)',
      [limit],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return detallesProducto;
  }

  async findOne(id: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_DetalleProducto_MostrarActivosPorId($1)',
      [id],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!result || result.length === 0) {
      throw new NotFoundException(
        `Detalle producto con ID ${id} no encontrado o inactivo`,
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return result[0];
  }

  async findByCodigo(codigo: string, limit: number = 100) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const detallesProducto = await this.dataSource.query(
      'SELECT * FROM fn_DetalleProducto_MostrarActivosPorCodigo($1, $2)',
      [codigo, limit],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return detallesProducto;
  }

  async update(id: number, updateDetalleProductoDto: UpdateDetalleProductoDto) {
    const detalleProductoExistente =
      await this.detalleProductoRepository.findOne({
        where: { Id: id },
      });

    if (!detalleProductoExistente) {
      throw new NotFoundException(
        `Detalle producto con ID ${id} no encontrado`,
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_DetalleProducto_Editar($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [
        id,
        updateDetalleProductoDto.categoriaId,
        updateDetalleProductoDto.marcaId,
        updateDetalleProductoDto.modeloId,
        updateDetalleProductoDto.precioCompra,
        updateDetalleProductoDto.precioVenta,
        updateDetalleProductoDto.sku || null,
        updateDetalleProductoDto.observaciones || null,
        updateDetalleProductoDto.stockMinimo || 0,
        updateDetalleProductoDto.unidadMedida || null,
      ],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const exito = result[0]?.p_resultado || false;

    if (!exito) {
      throw new BadRequestException(
        'No se pudo actualizar el detalle producto',
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.findOne(id);
  }

  async activate(id: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_DetalleProducto_Activar($1)',
      [id],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const exito = result[0]?.p_resultado || false;

    if (!exito) {
      throw new NotFoundException(
        `Detalle producto con ID ${id} no encontrado`,
      );
    }

    return {
      message: 'Detalle producto activado exitosamente',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      detalleProducto: await this.findOne(id),
    };
  }

  async deactivate(id: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_DetalleProducto_Desactivar($1)',
      [id],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const exito = result[0]?.p_resultado || false;

    if (!exito) {
      throw new NotFoundException(
        `Detalle producto con ID ${id} no encontrado`,
      );
    }

    return {
      message: 'Detalle producto desactivado exitosamente',
    };
  }

  async findInactivos(limit: number = 100) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const detallesProducto = await this.dataSource.query(
      'SELECT * FROM fn_DetalleProducto_MostrarInactivos($1)',
      [limit],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return detallesProducto;
  }

  async findInactivosByCodigo(codigo: string, limit: number = 100) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const detallesProducto = await this.dataSource.query(
      'SELECT * FROM fn_DetalleProducto_MostrarInactivosPorCodigo($1, $2)',
      [codigo, limit],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return detallesProducto;
  }

  async findInactivoById(id: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_DetalleProducto_MostrarInactivosPorId($1)',
      [id],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!result || result.length === 0) {
      throw new NotFoundException(
        `Detalle producto inactivo con ID ${id} no encontrado`,
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return result[0];
  }
}
