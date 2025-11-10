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
import { MarcasService } from './marcas.service';
import { CreateMarcaDto, UpdateMarcaDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Catálogos - Marcas')
@Controller('marcas')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class MarcasController {
  constructor(private readonly marcasService: MarcasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva marca' })
  @ApiResponse({ status: 201, description: 'Marca creada exitosamente' })
  @ApiResponse({
    status: 409,
    description: 'Ya existe una marca con ese nombre',
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  create(@Body() createMarcaDto: CreateMarcaDto) {
    return this.marcasService.create(createMarcaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las marcas activas' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({ status: 200, description: 'Lista de marcas activas' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findAll(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.marcasService.findAll(limit || 100);
  }

  @Get('buscar')
  @ApiOperation({ summary: 'Buscar marcas activas por nombre' })
  @ApiQuery({
    name: 'nombre',
    required: true,
    type: String,
    example: 'Bacardi',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({ status: 200, description: 'Lista de marcas encontradas' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findByNombre(
    @Query('nombre') nombre: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.marcasService.findByNombre(nombre, limit || 100);
  }

  @Get('inactivas')
  @ApiOperation({ summary: 'Obtener todas las marcas inactivas' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({ status: 200, description: 'Lista de marcas inactivas' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findInactivas(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.marcasService.findInactivas(limit || 100);
  }

  @Get('inactivas/buscar')
  @ApiOperation({ summary: 'Buscar marcas inactivas por nombre' })
  @ApiQuery({
    name: 'nombre',
    required: true,
    type: String,
    example: 'Bacardi',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({
    status: 200,
    description: 'Lista de marcas inactivas encontradas',
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findInactivasByNombre(
    @Query('nombre') nombre: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.marcasService.findInactivasByNombre(nombre, limit || 100);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una marca activa por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Marca encontrada' })
  @ApiResponse({ status: 404, description: 'Marca no encontrada o inactiva' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.marcasService.findOne(id);
  }

  @Get('inactivas/:id')
  @ApiOperation({ summary: 'Obtener una marca inactiva por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Marca inactiva encontrada' })
  @ApiResponse({ status: 404, description: 'Marca inactiva no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findInactivaById(@Param('id', ParseIntPipe) id: number) {
    return this.marcasService.findInactivaById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una marca' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Marca actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Marca no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMarcaDto: UpdateMarcaDto,
  ) {
    return this.marcasService.update(id, updateMarcaDto);
  }

  @Patch(':id/activar')
  @ApiOperation({ summary: 'Activar una marca' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Marca activada exitosamente' })
  @ApiResponse({ status: 404, description: 'Marca no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.marcasService.activate(id);
  }

  @Patch(':id/desactivar')
  @ApiOperation({ summary: 'Desactivar una marca' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Marca desactivada exitosamente' })
  @ApiResponse({ status: 404, description: 'Marca no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.marcasService.deactivate(id);
  }
}
