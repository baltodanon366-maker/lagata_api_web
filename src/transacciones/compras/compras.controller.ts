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
import { ComprasService } from './compras.service';
import { CreateCompraDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Transacciones - Compras')
@Controller('compras')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ComprasController {
  constructor(private readonly comprasService: ComprasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva compra con detalles y actualización de stock' })
  @ApiResponse({ status: 201, description: 'Compra creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Error al crear la compra' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  create(@Request() req, @Body() createCompraDto: CreateCompraDto) {
    return this.comprasService.create(req.user.id, createCompraDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una compra por ID con sus detalles' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Compra encontrada' })
  @ApiResponse({ status: 404, description: 'Compra no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.comprasService.findOne(id);
  }

  @Get(':id/detalles')
  @ApiOperation({ summary: 'Obtener solo los detalles de una compra' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Detalles de la compra' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findDetalles(@Param('id', ParseIntPipe) id: number) {
    return this.comprasService.findDetalles(id);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener compras por rango de fechas' })
  @ApiQuery({ name: 'fechaInicio', required: true, type: String, example: '2024-01-01T00:00:00' })
  @ApiQuery({ name: 'fechaFin', required: true, type: String, example: '2024-12-31T23:59:59' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({ status: 200, description: 'Lista de compras en el rango de fechas' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findByRangoFechas(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.comprasService.findByRangoFechas(
      fechaInicio,
      fechaFin,
      limit || 100,
    );
  }
}

