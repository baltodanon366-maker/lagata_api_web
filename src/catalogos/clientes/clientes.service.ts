import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Cliente } from '../../database/postgresql/entities/cliente.entity';
import { CreateClienteDto, UpdateClienteDto } from './dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
    private dataSource: DataSource,
  ) {}

  async create(createClienteDto: CreateClienteDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_Cliente_Crear($1, $2, $3, $4, $5, $6, $7)',
      [
        createClienteDto.codigoCliente,
        createClienteDto.nombreCompleto,
        createClienteDto.razonSocial || null,
        createClienteDto.rfc || null,
        createClienteDto.direccion || null,
        createClienteDto.telefono || null,
        createClienteDto.email || null,
      ],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const clienteId = result[0]?.p_cliente_id;

    if (clienteId === -1) {
      throw new ConflictException('Ya existe un cliente con ese código');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const cliente = await this.dataSource.query(
      'SELECT * FROM fn_Cliente_MostrarActivosPorId($1)',
      [clienteId],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return cliente[0];
  }

  async findAll(limit: number = 100) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const clientes = await this.dataSource.query(
      'SELECT * FROM fn_Cliente_MostrarActivos($1)',
      [limit],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return clientes;
  }

  async findOne(id: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_Cliente_MostrarActivosPorId($1)',
      [id],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!result || result.length === 0) {
      throw new NotFoundException(
        `Cliente con ID ${id} no encontrado o inactivo`,
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return result[0];
  }

  async findByNombre(nombre: string, limit: number = 100) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const clientes = await this.dataSource.query(
      'SELECT * FROM fn_Cliente_MostrarActivosPorNombre($1, $2)',
      [nombre, limit],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return clientes;
  }

  async update(id: number, updateClienteDto: UpdateClienteDto) {
    const clienteExistente = await this.clienteRepository.findOne({
      where: { Id: id },
    });

    if (!clienteExistente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_Cliente_Editar($1, $2, $3, $4, $5, $6, $7)',
      [
        id,
        updateClienteDto.nombreCompleto,
        updateClienteDto.razonSocial || null,
        updateClienteDto.rfc || null,
        updateClienteDto.direccion || null,
        updateClienteDto.telefono || null,
        updateClienteDto.email || null,
      ],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const exito = result[0]?.p_resultado || false;

    if (!exito) {
      throw new BadRequestException('No se pudo actualizar el cliente');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.findOne(id);
  }

  async activate(id: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_Cliente_Activar($1)',
      [id],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const exito = result[0]?.p_resultado || false;

    if (!exito) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    return {
      message: 'Cliente activado exitosamente',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      cliente: await this.findOne(id),
    };
  }

  async deactivate(id: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_Cliente_Desactivar($1)',
      [id],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const exito = result[0]?.p_resultado || false;

    if (!exito) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    return {
      message: 'Cliente desactivado exitosamente',
    };
  }

  async findInactivos(limit: number = 100) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const clientes = await this.dataSource.query(
      'SELECT * FROM fn_Cliente_MostrarInactivos($1)',
      [limit],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return clientes;
  }

  async findInactivosByNombre(nombre: string, limit: number = 100) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const clientes = await this.dataSource.query(
      'SELECT * FROM fn_Cliente_MostrarInactivosPorNombre($1, $2)',
      [nombre, limit],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return clientes;
  }

  async findInactivoById(id: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_Cliente_MostrarInactivosPorId($1)',
      [id],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!result || result.length === 0) {
      throw new NotFoundException(
        `Cliente inactivo con ID ${id} no encontrado`,
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return result[0];
  }
}
