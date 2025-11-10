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
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto, UpdateCategoriaDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Catálogos - Categorías')
@Controller('categorias')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva categoría' })
  @ApiResponse({
    status: 201,
    description: 'Categoría creada exitosamente',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe una categoría con ese nombre',
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriasService.create(createCategoriaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las categorías activas' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Número máximo de resultados (default: 100)',
    example: 50,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorías activas',
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findAll(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.categoriasService.findAll(limit || 100);
  }

  @Get('buscar')
  @ApiOperation({ summary: 'Buscar categorías activas por nombre' })
  @ApiQuery({
    name: 'nombre',
    required: true,
    type: String,
    description: 'Nombre o parte del nombre a buscar',
    example: 'Licor',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Número máximo de resultados (default: 100)',
    example: 50,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorías encontradas',
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findByNombre(
    @Query('nombre') nombre: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.categoriasService.findByNombre(nombre, limit || 100);
  }

  @Get('inactivas')
  @ApiOperation({ summary: 'Obtener todas las categorías inactivas' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Número máximo de resultados (default: 100)',
    example: 50,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorías inactivas',
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findInactivas(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.categoriasService.findInactivas(limit || 100);
  }

  @Get('inactivas/buscar')
  @ApiOperation({ summary: 'Buscar categorías inactivas por nombre' })
  @ApiQuery({
    name: 'nombre',
    required: true,
    type: String,
    description: 'Nombre o parte del nombre a buscar',
    example: 'Licor',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Número máximo de resultados (default: 100)',
    example: 50,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorías inactivas encontradas',
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findInactivasByNombre(
    @Query('nombre') nombre: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.categoriasService.findInactivasByNombre(nombre, limit || 100);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una categoría activa por ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID de la categoría',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Categoría encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoría no encontrada o inactiva',
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasService.findOne(id);
  }

  @Get('inactivas/:id')
  @ApiOperation({ summary: 'Obtener una categoría inactiva por ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID de la categoría inactiva',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Categoría inactiva encontrada',
  })
  @ApiResponse({ status: 404, description: 'Categoría inactiva no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findInactivaById(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasService.findInactivaById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una categoría' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID de la categoría',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Categoría actualizada exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoriaDto: UpdateCategoriaDto,
  ) {
    return this.categoriasService.update(id, updateCategoriaDto);
  }

  @Patch(':id/activar')
  @ApiOperation({ summary: 'Activar una categoría' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID de la categoría',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Categoría activada exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasService.activate(id);
  }

  @Patch(':id/desactivar')
  @ApiOperation({ summary: 'Desactivar una categoría' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID de la categoría',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Categoría desactivada exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasService.deactivate(id);
  }
}
