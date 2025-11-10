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
import { ModelosService } from './modelos.service';
import { CreateModeloDto, UpdateModeloDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Catálogos - Modelos')
@Controller('modelos')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ModelosController {
  constructor(private readonly modelosService: ModelosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo modelo' })
  @ApiResponse({ status: 201, description: 'Modelo creado exitosamente' })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un modelo con ese nombre',
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  create(@Body() createModeloDto: CreateModeloDto) {
    return this.modelosService.create(createModeloDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los modelos activos' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({ status: 200, description: 'Lista de modelos activos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findAll(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.modelosService.findAll(limit || 100);
  }

  @Get('buscar')
  @ApiOperation({ summary: 'Buscar modelos activos por nombre' })
  @ApiQuery({ name: 'nombre', required: true, type: String, example: '750ml' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({ status: 200, description: 'Lista de modelos encontrados' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findByNombre(
    @Query('nombre') nombre: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.modelosService.findByNombre(nombre, limit || 100);
  }

  @Get('inactivos')
  @ApiOperation({ summary: 'Obtener todos los modelos inactivos' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({ status: 200, description: 'Lista de modelos inactivos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findInactivos(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.modelosService.findInactivos(limit || 100);
  }

  @Get('inactivos/buscar')
  @ApiOperation({ summary: 'Buscar modelos inactivos por nombre' })
  @ApiQuery({ name: 'nombre', required: true, type: String, example: '750ml' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({
    status: 200,
    description: 'Lista de modelos inactivos encontrados',
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findInactivosByNombre(
    @Query('nombre') nombre: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.modelosService.findInactivosByNombre(nombre, limit || 100);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un modelo activo por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Modelo encontrado' })
  @ApiResponse({ status: 404, description: 'Modelo no encontrado o inactivo' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.modelosService.findOne(id);
  }

  @Get('inactivos/:id')
  @ApiOperation({ summary: 'Obtener un modelo inactivo por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Modelo inactivo encontrado' })
  @ApiResponse({ status: 404, description: 'Modelo inactivo no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findInactivoById(@Param('id', ParseIntPipe) id: number) {
    return this.modelosService.findInactivoById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un modelo' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Modelo actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Modelo no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateModeloDto: UpdateModeloDto,
  ) {
    return this.modelosService.update(id, updateModeloDto);
  }

  @Patch(':id/activar')
  @ApiOperation({ summary: 'Activar un modelo' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Modelo activado exitosamente' })
  @ApiResponse({ status: 404, description: 'Modelo no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.modelosService.activate(id);
  }

  @Patch(':id/desactivar')
  @ApiOperation({ summary: 'Desactivar un modelo' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Modelo desactivado exitosamente' })
  @ApiResponse({ status: 404, description: 'Modelo no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.modelosService.deactivate(id);
  }
}
