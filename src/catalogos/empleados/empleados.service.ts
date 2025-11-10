import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Empleado } from '../../database/postgresql/entities/empleado.entity';
import { CreateEmpleadoDto, UpdateEmpleadoDto } from './dto';

@Injectable()
export class EmpleadosService {
  constructor(
    @InjectRepository(Empleado)
    private empleadoRepository: Repository<Empleado>,
    private dataSource: DataSource,
  ) {}

  async create(createEmpleadoDto: CreateEmpleadoDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_Empleado_Crear($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
      [
        createEmpleadoDto.codigoEmpleado,
        createEmpleadoDto.nombreCompleto,
        createEmpleadoDto.fechaIngreso,
        createEmpleadoDto.usuarioId || null,
        createEmpleadoDto.telefono || null,
        createEmpleadoDto.email || null,
        createEmpleadoDto.direccion || null,
        createEmpleadoDto.fechaNacimiento || null,
        createEmpleadoDto.salario || null,
        createEmpleadoDto.departamento || null,
        createEmpleadoDto.puesto || null,
      ],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const empleadoId = result[0]?.p_empleado_id;

    if (empleadoId === -1) {
      throw new ConflictException('Ya existe un empleado con ese código');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const empleado = await this.dataSource.query(
      'SELECT * FROM fn_Empleado_MostrarActivosPorId($1)',
      [empleadoId],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return empleado[0];
  }

  async findAll(limit: number = 100) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const empleados = await this.dataSource.query(
      'SELECT * FROM fn_Empleado_MostrarActivos($1)',
      [limit],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return empleados;
  }

  async findOne(id: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_Empleado_MostrarActivosPorId($1)',
      [id],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!result || result.length === 0) {
      throw new NotFoundException(
        `Empleado con ID ${id} no encontrado o inactivo`,
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return result[0];
  }

  async findByNombre(nombre: string, limit: number = 100) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const empleados = await this.dataSource.query(
      'SELECT * FROM fn_Empleado_MostrarActivosPorNombre($1, $2)',
      [nombre, limit],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return empleados;
  }

  async update(id: number, updateEmpleadoDto: UpdateEmpleadoDto) {
    const empleadoExistente = await this.empleadoRepository.findOne({
      where: { Id: id },
    });

    if (!empleadoExistente) {
      throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_Empleado_Editar($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
      [
        id,
        updateEmpleadoDto.nombreCompleto,
        updateEmpleadoDto.fechaIngreso,
        updateEmpleadoDto.usuarioId || null,
        updateEmpleadoDto.telefono || null,
        updateEmpleadoDto.email || null,
        updateEmpleadoDto.direccion || null,
        updateEmpleadoDto.fechaNacimiento || null,
        updateEmpleadoDto.salario || null,
        updateEmpleadoDto.departamento || null,
        updateEmpleadoDto.puesto || null,
      ],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const exito = result[0]?.p_resultado || false;

    if (!exito) {
      throw new BadRequestException('No se pudo actualizar el empleado');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.findOne(id);
  }

  async activate(id: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_Empleado_Activar($1)',
      [id],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const exito = result[0]?.p_resultado || false;

    if (!exito) {
      throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
    }

    return {
      message: 'Empleado activado exitosamente',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      empleado: await this.findOne(id),
    };
  }

  async deactivate(id: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_Empleado_Desactivar($1)',
      [id],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const exito = result[0]?.p_resultado || false;

    if (!exito) {
      throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
    }

    return {
      message: 'Empleado desactivado exitosamente',
    };
  }

  async findInactivos(limit: number = 100) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const empleados = await this.dataSource.query(
      'SELECT * FROM fn_Empleado_MostrarInactivos($1)',
      [limit],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return empleados;
  }

  async findInactivosByNombre(nombre: string, limit: number = 100) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const empleados = await this.dataSource.query(
      'SELECT * FROM fn_Empleado_MostrarInactivosPorNombre($1, $2)',
      [nombre, limit],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return empleados;
  }

  async findInactivoById(id: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_Empleado_MostrarInactivosPorId($1)',
      [id],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!result || result.length === 0) {
      throw new NotFoundException(
        `Empleado inactivo con ID ${id} no encontrado`,
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return result[0];
  }
}
