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
import { DetalleProductoService } from './detalle-producto.service';
import { CreateDetalleProductoDto, UpdateDetalleProductoDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Catálogos - Detalle Producto')
@Controller('detalle-producto')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class DetalleProductoController {
  constructor(
    private readonly detalleProductoService: DetalleProductoService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo detalle producto' })
  @ApiResponse({
    status: 201,
    description: 'Detalle producto creado exitosamente',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un detalle producto con ese código',
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  create(@Body() createDetalleProductoDto: CreateDetalleProductoDto) {
    return this.detalleProductoService.create(createDetalleProductoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los detalles producto activos' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({
    status: 200,
    description: 'Lista de detalles producto activos',
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findAll(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.detalleProductoService.findAll(limit || 100);
  }

  @Get('buscar')
  @ApiOperation({ summary: 'Buscar detalles producto activos por código' })
  @ApiQuery({ name: 'codigo', required: true, type: String, example: 'DP001' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({
    status: 200,
    description: 'Lista de detalles producto encontrados',
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findByCodigo(
    @Query('codigo') codigo: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.detalleProductoService.findByCodigo(codigo, limit || 100);
  }

  @Get('inactivos')
  @ApiOperation({ summary: 'Obtener todos los detalles producto inactivos' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({
    status: 200,
    description: 'Lista de detalles producto inactivos',
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findInactivos(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.detalleProductoService.findInactivos(limit || 100);
  }

  @Get('inactivos/buscar')
  @ApiOperation({ summary: 'Buscar detalles producto inactivos por código' })
  @ApiQuery({ name: 'codigo', required: true, type: String, example: 'DP001' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({
    status: 200,
    description: 'Lista de detalles producto inactivos encontrados',
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findInactivosByCodigo(
    @Query('codigo') codigo: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.detalleProductoService.findInactivosByCodigo(
      codigo,
      limit || 100,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un detalle producto activo por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Detalle producto encontrado' })
  @ApiResponse({
    status: 404,
    description: 'Detalle producto no encontrado o inactivo',
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.detalleProductoService.findOne(id);
  }

  @Get('inactivos/:id')
  @ApiOperation({ summary: 'Obtener un detalle producto inactivo por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Detalle producto inactivo encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Detalle producto inactivo no encontrado',
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findInactivoById(@Param('id', ParseIntPipe) id: number) {
    return this.detalleProductoService.findInactivoById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un detalle producto' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Detalle producto actualizado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Detalle producto no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDetalleProductoDto: UpdateDetalleProductoDto,
  ) {
    return this.detalleProductoService.update(id, updateDetalleProductoDto);
  }

  @Patch(':id/activar')
  @ApiOperation({ summary: 'Activar un detalle producto' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Detalle producto activado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Detalle producto no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.detalleProductoService.activate(id);
  }

  @Patch(':id/desactivar')
  @ApiOperation({ summary: 'Desactivar un detalle producto' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Detalle producto desactivado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Detalle producto no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.detalleProductoService.deactivate(id);
  }
}
