import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Transacciones - Ventas')
@Controller('ventas')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva venta con detalles y actualización de stock (salida)' })
  @ApiResponse({ status: 201, description: 'Venta creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Error al crear la venta (puede ser stock insuficiente)' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  create(@Request() req, @Body() createVentaDto: CreateVentaDto) {
    return this.ventasService.create(req.user.id, createVentaDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una venta por ID con sus detalles' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Venta encontrada' })
  @ApiResponse({ status: 404, description: 'Venta no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ventasService.findOne(id);
  }

  @Get(':id/detalles')
  @ApiOperation({ summary: 'Obtener solo los detalles de una venta' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Detalles de la venta' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findDetalles(@Param('id', ParseIntPipe) id: number) {
    return this.ventasService.findDetalles(id);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener ventas por rango de fechas' })
  @ApiQuery({ name: 'fechaInicio', required: true, type: String, example: '2024-01-01T00:00:00' })
  @ApiQuery({ name: 'fechaFin', required: true, type: String, example: '2024-12-31T23:59:59' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({ status: 200, description: 'Lista de ventas en el rango de fechas' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findByRangoFechas(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.ventasService.findByRangoFechas(
      fechaInicio,
      fechaFin,
      limit || 100,
    );
  }
}

