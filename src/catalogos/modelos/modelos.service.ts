import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Modelo } from '../../database/postgresql/entities/modelo.entity';
import { CreateModeloDto, UpdateModeloDto } from './dto';

@Injectable()
export class ModelosService {
  constructor(
    @InjectRepository(Modelo)
    private modeloRepository: Repository<Modelo>,
    private dataSource: DataSource,
  ) {}

  async create(createModeloDto: CreateModeloDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_Modelo_Crear($1, $2)',
      [createModeloDto.nombre, createModeloDto.descripcion || null],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const modeloId = result[0]?.p_modelo_id;

    if (modeloId === -1) {
      throw new ConflictException('Ya existe un modelo con ese nombre');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const modelo = await this.dataSource.query(
      'SELECT * FROM fn_Modelo_MostrarActivosPorId($1)',
      [modeloId],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return modelo[0];
  }

  async findAll(limit: number = 100) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const modelos = await this.dataSource.query(
      'SELECT * FROM fn_Modelo_MostrarActivos($1)',
      [limit],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return modelos;
  }

  async findOne(id: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_Modelo_MostrarActivosPorId($1)',
      [id],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!result || result.length === 0) {
      throw new NotFoundException(
        `Modelo con ID ${id} no encontrado o inactivo`,
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return result[0];
  }

  async findByNombre(nombre: string, limit: number = 100) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const modelos = await this.dataSource.query(
      'SELECT * FROM fn_Modelo_MostrarActivosPorNombre($1, $2)',
      [nombre, limit],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return modelos;
  }

  async update(id: number, updateModeloDto: UpdateModeloDto) {
    const modeloExistente = await this.modeloRepository.findOne({
      where: { Id: id },
    });

    if (!modeloExistente) {
      throw new NotFoundException(`Modelo con ID ${id} no encontrado`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_Modelo_Editar($1, $2, $3)',
      [id, updateModeloDto.nombre, updateModeloDto.descripcion || null],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const exito = result[0]?.p_resultado || false;

    if (!exito) {
      throw new BadRequestException('No se pudo actualizar el modelo');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.findOne(id);
  }

  async activate(id: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_Modelo_Activar($1)',
      [id],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const exito = result[0]?.p_resultado || false;

    if (!exito) {
      throw new NotFoundException(`Modelo con ID ${id} no encontrado`);
    }

    return {
      message: 'Modelo activado exitosamente',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      modelo: await this.findOne(id),
    };
  }

  async deactivate(id: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_Modelo_Desactivar($1)',
      [id],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const exito = result[0]?.p_resultado || false;

    if (!exito) {
      throw new NotFoundException(`Modelo con ID ${id} no encontrado`);
    }

    return {
      message: 'Modelo desactivado exitosamente',
    };
  }

  async findInactivos(limit: number = 100) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const modelos = await this.dataSource.query(
      'SELECT * FROM fn_Modelo_MostrarInactivos($1)',
      [limit],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return modelos;
  }

  async findInactivosByNombre(nombre: string, limit: number = 100) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const modelos = await this.dataSource.query(
      'SELECT * FROM fn_Modelo_MostrarInactivosPorNombre($1, $2)',
      [nombre, limit],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return modelos;
  }

  async findInactivoById(id: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_Modelo_MostrarInactivosPorId($1)',
      [id],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!result || result.length === 0) {
      throw new NotFoundException(`Modelo inactivo con ID ${id} no encontrado`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return result[0];
  }
}
