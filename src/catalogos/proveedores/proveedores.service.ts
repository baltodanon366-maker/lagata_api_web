import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Proveedor } from '../../database/postgresql/entities/proveedor.entity';
import { CreateProveedorDto, UpdateProveedorDto } from './dto';

@Injectable()
export class ProveedoresService {
  constructor(
    @InjectRepository(Proveedor)
    private proveedorRepository: Repository<Proveedor>,
    private dataSource: DataSource,
  ) {}

  async create(createProveedorDto: CreateProveedorDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_Proveedor_Crear($1, $2, $3, $4, $5, $6, $7)',
      [
        createProveedorDto.codigoProveedor,
        createProveedorDto.nombre,
        createProveedorDto.razonSocial || null,
        createProveedorDto.rfc || null,
        createProveedorDto.direccion || null,
        createProveedorDto.telefono || null,
        createProveedorDto.email || null,
      ],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const proveedorId = result[0]?.p_proveedor_id;

    if (proveedorId === -1) {
      throw new ConflictException('Ya existe un proveedor con ese código');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const proveedor = await this.dataSource.query(
      'SELECT * FROM fn_Proveedor_MostrarActivosPorId($1)',
      [proveedorId],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return proveedor[0];
  }

  async findAll(limit: number = 100) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const proveedores = await this.dataSource.query(
      'SELECT * FROM fn_Proveedor_MostrarActivos($1)',
      [limit],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return proveedores;
  }

  async findOne(id: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_Proveedor_MostrarActivosPorId($1)',
      [id],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!result || result.length === 0) {
      throw new NotFoundException(
        `Proveedor con ID ${id} no encontrado o inactivo`,
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return result[0];
  }

  async findByNombre(nombre: string, limit: number = 100) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const proveedores = await this.dataSource.query(
      'SELECT * FROM fn_Proveedor_MostrarActivosPorNombre($1, $2)',
      [nombre, limit],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return proveedores;
  }

  async update(id: number, updateProveedorDto: UpdateProveedorDto) {
    const proveedorExistente = await this.proveedorRepository.findOne({
      where: { Id: id },
    });

    if (!proveedorExistente) {
      throw new NotFoundException(`Proveedor con ID ${id} no encontrado`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_Proveedor_Editar($1, $2, $3, $4, $5, $6, $7)',
      [
        id,
        updateProveedorDto.nombre,
        updateProveedorDto.razonSocial || null,
        updateProveedorDto.rfc || null,
        updateProveedorDto.direccion || null,
        updateProveedorDto.telefono || null,
        updateProveedorDto.email || null,
      ],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const exito = result[0]?.p_resultado || false;

    if (!exito) {
      throw new BadRequestException('No se pudo actualizar el proveedor');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.findOne(id);
  }

  async activate(id: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_Proveedor_Activar($1)',
      [id],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const exito = result[0]?.p_resultado || false;

    if (!exito) {
      throw new NotFoundException(`Proveedor con ID ${id} no encontrado`);
    }

    return {
      message: 'Proveedor activado exitosamente',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      proveedor: await this.findOne(id),
    };
  }

  async deactivate(id: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_Proveedor_Desactivar($1)',
      [id],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const exito = result[0]?.p_resultado || false;

    if (!exito) {
      throw new NotFoundException(`Proveedor con ID ${id} no encontrado`);
    }

    return {
      message: 'Proveedor desactivado exitosamente',
    };
  }

  async findInactivos(limit: number = 100) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const proveedores = await this.dataSource.query(
      'SELECT * FROM fn_Proveedor_MostrarInactivos($1)',
      [limit],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return proveedores;
  }

  async findInactivosByNombre(nombre: string, limit: number = 100) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const proveedores = await this.dataSource.query(
      'SELECT * FROM fn_Proveedor_MostrarInactivosPorNombre($1, $2)',
      [nombre, limit],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return proveedores;
  }

  async findInactivoById(id: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_Proveedor_MostrarInactivosPorId($1)',
      [id],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!result || result.length === 0) {
      throw new NotFoundException(
        `Proveedor inactivo con ID ${id} no encontrado`,
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return result[0];
  }
}
