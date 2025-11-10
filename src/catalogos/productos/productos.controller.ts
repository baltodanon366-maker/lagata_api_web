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
import { ProductosService } from './productos.service';
import { CreateProductoDto, UpdateProductoDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Catálogos - Productos')
@Controller('productos')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos activos' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({ status: 200, description: 'Lista de productos activos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findAll(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.productosService.findAll(limit || 100);
  }

  @Get('buscar')
  @ApiOperation({ summary: 'Buscar productos activos por nombre' })
  @ApiQuery({ name: 'nombre', required: true, type: String, example: 'Ron' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({ status: 200, description: 'Lista de productos encontrados' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findByNombre(
    @Query('nombre') nombre: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.productosService.findByNombre(nombre, limit || 100);
  }

  @Get('inactivos')
  @ApiOperation({ summary: 'Obtener todos los productos inactivos' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({ status: 200, description: 'Lista de productos inactivos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findInactivos(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.productosService.findInactivos(limit || 100);
  }

  @Get('inactivos/buscar')
  @ApiOperation({ summary: 'Buscar productos inactivos por nombre' })
  @ApiQuery({ name: 'nombre', required: true, type: String, example: 'Ron' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos inactivos encontrados',
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findInactivosByNombre(
    @Query('nombre') nombre: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.productosService.findInactivosByNombre(nombre, limit || 100);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto activo por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Producto encontrado' })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado o inactivo',
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.findOne(id);
  }

  @Get('inactivos/:id')
  @ApiOperation({ summary: 'Obtener un producto inactivo por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Producto inactivo encontrado' })
  @ApiResponse({ status: 404, description: 'Producto inactivo no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findInactivoById(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.findInactivoById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un producto' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Producto actualizado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    return this.productosService.update(id, updateProductoDto);
  }

  @Patch(':id/activar')
  @ApiOperation({ summary: 'Activar un producto' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Producto activado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.activate(id);
  }

  @Patch(':id/desactivar')
  @ApiOperation({ summary: 'Desactivar un producto' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Producto desactivado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.deactivate(id);
  }
}
