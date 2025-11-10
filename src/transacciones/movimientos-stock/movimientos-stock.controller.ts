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
import { MovimientosStockService } from './movimientos-stock.service';
import { AjusteStockDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Transacciones - Movimientos Stock')
@Controller('movimientos-stock')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class MovimientosStockController {
  constructor(private readonly movimientosStockService: MovimientosStockService) {}

  @Post('ajuste')
  @ApiOperation({ summary: 'Realizar un ajuste manual de stock' })
  @ApiResponse({ status: 201, description: 'Ajuste de stock realizado exitosamente' })
  @ApiResponse({ status: 400, description: 'Error al realizar el ajuste' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  ajusteStock(@Request() req, @Body() ajusteStockDto: AjusteStockDto) {
    return this.movimientosStockService.ajusteStock(req.user.id, ajusteStockDto);
  }

  @Get('producto/:detalleProductoId')
  @ApiOperation({ summary: 'Obtener movimientos de stock de un producto' })
  @ApiParam({ name: 'detalleProductoId', type: Number, example: 1 })
  @ApiQuery({ name: 'fechaInicio', required: false, type: String, example: '2024-01-01T00:00:00' })
  @ApiQuery({ name: 'fechaFin', required: false, type: String, example: '2024-12-31T23:59:59' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({ status: 200, description: 'Lista de movimientos de stock' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findByProducto(
    @Param('detalleProductoId', ParseIntPipe) detalleProductoId: number,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.movimientosStockService.findByProducto(
      detalleProductoId,
      fechaInicio,
      fechaFin,
      limit || 100,
    );
  }
}

