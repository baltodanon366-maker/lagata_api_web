import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Marca } from '../../database/postgresql/entities/marca.entity';
import { CreateMarcaDto, UpdateMarcaDto } from './dto';

@Injectable()
export class MarcasService {
  constructor(
    @InjectRepository(Marca)
    private marcaRepository: Repository<Marca>,
    private dataSource: DataSource,
  ) {}

  async create(createMarcaDto: CreateMarcaDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_Marca_Crear($1, $2)',
      [createMarcaDto.nombre, createMarcaDto.descripcion || null],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const marcaId = result[0]?.p_marca_id;

    if (marcaId === -1) {
      throw new ConflictException('Ya existe una marca con ese nombre');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const marca = await this.dataSource.query(
      'SELECT * FROM fn_Marca_MostrarActivosPorId($1)',
      [marcaId],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return marca[0];
  }

  async findAll(limit: number = 100) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const marcas = await this.dataSource.query(
      'SELECT * FROM fn_Marca_MostrarActivos($1)',
      [limit],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return marcas;
  }

  async findOne(id: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_Marca_MostrarActivosPorId($1)',
      [id],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!result || result.length === 0) {
      throw new NotFoundException(
        `Marca con ID ${id} no encontrada o inactiva`,
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return result[0];
  }

  async findByNombre(nombre: string, limit: number = 100) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const marcas = await this.dataSource.query(
      'SELECT * FROM fn_Marca_MostrarActivosPorNombre($1, $2)',
      [nombre, limit],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return marcas;
  }

  async update(id: number, updateMarcaDto: UpdateMarcaDto) {
    const marcaExistente = await this.marcaRepository.findOne({
      where: { Id: id },
    });

    if (!marcaExistente) {
      throw new NotFoundException(`Marca con ID ${id} no encontrada`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_Marca_Editar($1, $2, $3)',
      [id, updateMarcaDto.nombre, updateMarcaDto.descripcion || null],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const exito = result[0]?.p_resultado || false;

    if (!exito) {
      throw new BadRequestException('No se pudo actualizar la marca');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.findOne(id);
  }

  async activate(id: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_Marca_Activar($1)',
      [id],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const exito = result[0]?.p_resultado || false;

    if (!exito) {
      throw new NotFoundException(`Marca con ID ${id} no encontrada`);
    }

    return {
      message: 'Marca activada exitosamente',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      marca: await this.findOne(id),
    };
  }

  async deactivate(id: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_Marca_Desactivar($1)',
      [id],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const exito = result[0]?.p_resultado || false;

    if (!exito) {
      throw new NotFoundException(`Marca con ID ${id} no encontrada`);
    }

    return {
      message: 'Marca desactivada exitosamente',
    };
  }

  async findInactivas(limit: number = 100) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const marcas = await this.dataSource.query(
      'SELECT * FROM fn_Marca_MostrarInactivos($1)',
      [limit],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return marcas;
  }

  async findInactivasByNombre(nombre: string, limit: number = 100) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const marcas = await this.dataSource.query(
      'SELECT * FROM fn_Marca_MostrarInactivosPorNombre($1, $2)',
      [nombre, limit],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return marcas;
  }

  async findInactivaById(id: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_Marca_MostrarInactivosPorId($1)',
      [id],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!result || result.length === 0) {
      throw new NotFoundException(`Marca inactiva con ID ${id} no encontrada`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return result[0];
  }
}
