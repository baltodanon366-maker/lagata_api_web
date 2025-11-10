import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Categoria } from '../../database/postgresql/entities/categoria.entity';
import { CreateCategoriaDto, UpdateCategoriaDto } from './dto';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private categoriaRepository: Repository<Categoria>,
    private dataSource: DataSource,
  ) {}

  async create(createCategoriaDto: CreateCategoriaDto) {
    // Usar función PostgreSQL fn_Categoria_Crear
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_Categoria_Crear($1, $2)',
      [createCategoriaDto.nombre, createCategoriaDto.descripcion || null],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const categoriaId = result[0]?.p_categoria_id;

    if (categoriaId === -1) {
      throw new ConflictException('Ya existe una categoría con ese nombre');
    }

    // Obtener la categoría creada
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const categoria = await this.dataSource.query(
      'SELECT * FROM fn_Categoria_MostrarActivosPorId($1)',
      [categoriaId],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return categoria[0];
  }

  async findAll(limit: number = 100) {
    // Usar función PostgreSQL fn_Categoria_MostrarActivos
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const categorias = await this.dataSource.query(
      'SELECT * FROM fn_Categoria_MostrarActivos($1)',
      [limit],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return categorias;
  }

  async findOne(id: number) {
    // Usar función PostgreSQL fn_Categoria_MostrarActivosPorId
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_Categoria_MostrarActivosPorId($1)',
      [id],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!result || result.length === 0) {
      throw new NotFoundException(
        `Categoría con ID ${id} no encontrada o inactiva`,
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return result[0];
  }

  async findByNombre(nombre: string, limit: number = 100) {
    // Usar función PostgreSQL fn_Categoria_MostrarActivosPorNombre
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const categorias = await this.dataSource.query(
      'SELECT * FROM fn_Categoria_MostrarActivosPorNombre($1, $2)',
      [nombre, limit],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return categorias;
  }

  async update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    // Verificar que la categoría existe
    const categoriaExistente = await this.categoriaRepository.findOne({
      where: { Id: id },
    });

    if (!categoriaExistente) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    // Usar función PostgreSQL fn_Categoria_Editar
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_Categoria_Editar($1, $2, $3)',
      [id, updateCategoriaDto.nombre, updateCategoriaDto.descripcion || null],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const exito = result[0]?.p_resultado || false;

    if (!exito) {
      throw new BadRequestException('No se pudo actualizar la categoría');
    }

    // Obtener la categoría actualizada
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.findOne(id);
  }

  async activate(id: number) {
    // Usar función PostgreSQL fn_Categoria_Activar
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_Categoria_Activar($1)',
      [id],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const exito = result[0]?.p_resultado || false;

    if (!exito) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    return {
      message: 'Categoría activada exitosamente',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      categoria: await this.findOne(id),
    };
  }

  async deactivate(id: number) {
    // Usar función PostgreSQL fn_Categoria_Desactivar
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_Categoria_Desactivar($1)',
      [id],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const exito = result[0]?.p_resultado || false;

    if (!exito) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    return {
      message: 'Categoría desactivada exitosamente',
    };
  }

  async findInactivas(limit: number = 100) {
    // Usar función PostgreSQL fn_Categoria_MostrarInactivos
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const categorias = await this.dataSource.query(
      'SELECT * FROM fn_Categoria_MostrarInactivos($1)',
      [limit],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return categorias;
  }

  async findInactivasByNombre(nombre: string, limit: number = 100) {
    // Usar función PostgreSQL fn_Categoria_MostrarInactivosPorNombre
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const categorias = await this.dataSource.query(
      'SELECT * FROM fn_Categoria_MostrarInactivosPorNombre($1, $2)',
      [nombre, limit],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return categorias;
  }

  async findInactivaById(id: number) {
    // Usar función PostgreSQL fn_Categoria_MostrarInactivosPorId
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_Categoria_MostrarInactivosPorId($1)',
      [id],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!result || result.length === 0) {
      throw new NotFoundException(
        `Categoría inactiva con ID ${id} no encontrada`,
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return result[0];
  }
}
