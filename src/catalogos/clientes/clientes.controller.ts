import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { ClientesService } from './clientes.service';
import { CreateClienteDto, UpdateClienteDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Catálogos - Clientes')
@Controller('clientes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente creado exitosamente' })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un cliente con ese código',
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clientesService.create(createClienteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los clientes activos' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({ status: 200, description: 'Lista de clientes activos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findAll(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.clientesService.findAll(limit || 100);
  }

  @Get('buscar')
  @ApiOperation({ summary: 'Buscar clientes activos por nombre' })
  @ApiQuery({ name: 'nombre', required: true, type: String, example: 'Juan' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({ status: 200, description: 'Lista de clientes encontrados' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findByNombre(
    @Query('nombre') nombre: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.clientesService.findByNombre(nombre, limit || 100);
  }

  @Get('inactivos')
  @ApiOperation({ summary: 'Obtener todos los clientes inactivos' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({ status: 200, description: 'Lista de clientes inactivos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findInactivos(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.clientesService.findInactivos(limit || 100);
  }

  @Get('inactivos/buscar')
  @ApiOperation({ summary: 'Buscar clientes inactivos por nombre' })
  @ApiQuery({ name: 'nombre', required: true, type: String, example: 'Juan' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes inactivos encontrados',
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findInactivosByNombre(
    @Query('nombre') nombre: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.clientesService.findInactivosByNombre(nombre, limit || 100);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un cliente activo por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado o inactivo' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.findOne(id);
  }

  @Get('inactivos/:id')
  @ApiOperation({ summary: 'Obtener un cliente inactivo por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Cliente inactivo encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente inactivo no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findInactivoById(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.findInactivoById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un cliente' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Cliente actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClienteDto: UpdateClienteDto,
  ) {
    return this.clientesService.update(id, updateClienteDto);
  }

  @Patch(':id/activar')
  @ApiOperation({ summary: 'Activar un cliente' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Cliente activado exitosamente' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.activate(id);
  }

  @Patch(':id/desactivar')
  @ApiOperation({ summary: 'Desactivar un cliente' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Cliente desactivado exitosamente' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.deactivate(id);
  }
}
