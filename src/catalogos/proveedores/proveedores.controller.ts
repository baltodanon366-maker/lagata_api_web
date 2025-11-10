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
import { ProveedoresService } from './proveedores.service';
import { CreateProveedorDto, UpdateProveedorDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Catálogos - Proveedores')
@Controller('proveedores')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ProveedoresController {
  constructor(private readonly proveedoresService: ProveedoresService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo proveedor' })
  @ApiResponse({ status: 201, description: 'Proveedor creado exitosamente' })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un proveedor con ese código',
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  create(@Body() createProveedorDto: CreateProveedorDto) {
    return this.proveedoresService.create(createProveedorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los proveedores activos' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({ status: 200, description: 'Lista de proveedores activos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findAll(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.proveedoresService.findAll(limit || 100);
  }

  @Get('buscar')
  @ApiOperation({ summary: 'Buscar proveedores activos por nombre' })
  @ApiQuery({
    name: 'nombre',
    required: true,
    type: String,
    example: 'Distribuidora',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({ status: 200, description: 'Lista de proveedores encontrados' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findByNombre(
    @Query('nombre') nombre: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.proveedoresService.findByNombre(nombre, limit || 100);
  }

  @Get('inactivos')
  @ApiOperation({ summary: 'Obtener todos los proveedores inactivos' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({ status: 200, description: 'Lista de proveedores inactivos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findInactivos(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.proveedoresService.findInactivos(limit || 100);
  }

  @Get('inactivos/buscar')
  @ApiOperation({ summary: 'Buscar proveedores inactivos por nombre' })
  @ApiQuery({
    name: 'nombre',
    required: true,
    type: String,
    example: 'Distribuidora',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({
    status: 200,
    description: 'Lista de proveedores inactivos encontrados',
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findInactivosByNombre(
    @Query('nombre') nombre: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.proveedoresService.findInactivosByNombre(nombre, limit || 100);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un proveedor activo por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Proveedor encontrado' })
  @ApiResponse({
    status: 404,
    description: 'Proveedor no encontrado o inactivo',
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.proveedoresService.findOne(id);
  }

  @Get('inactivos/:id')
  @ApiOperation({ summary: 'Obtener un proveedor inactivo por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Proveedor inactivo encontrado' })
  @ApiResponse({ status: 404, description: 'Proveedor inactivo no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findInactivoById(@Param('id', ParseIntPipe) id: number) {
    return this.proveedoresService.findInactivoById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un proveedor' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Proveedor actualizado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Proveedor no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProveedorDto: UpdateProveedorDto,
  ) {
    return this.proveedoresService.update(id, updateProveedorDto);
  }

  @Patch(':id/activar')
  @ApiOperation({ summary: 'Activar un proveedor' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Proveedor activado exitosamente' })
  @ApiResponse({ status: 404, description: 'Proveedor no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.proveedoresService.activate(id);
  }

  @Patch(':id/desactivar')
  @ApiOperation({ summary: 'Desactivar un proveedor' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Proveedor desactivado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Proveedor no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.proveedoresService.deactivate(id);
  }
}
