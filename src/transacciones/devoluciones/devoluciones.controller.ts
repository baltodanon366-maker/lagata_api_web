import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { DevolucionesService } from './devoluciones.service';
import { CreateDevolucionDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Transacciones - Devoluciones')
@Controller('devoluciones')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class DevolucionesController {
  constructor(private readonly devolucionesService: DevolucionesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva devolución con detalles y actualización de stock (entrada)' })
  @ApiResponse({ status: 201, description: 'Devolución creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Error al crear la devolución' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  create(@Request() req, @Body() createDevolucionDto: CreateDevolucionDto) {
    return this.devolucionesService.create(req.user.id, createDevolucionDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una devolución por ID con sus detalles' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Devolución encontrada' })
  @ApiResponse({ status: 404, description: 'Devolución no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.devolucionesService.findOne(id);
  }

  @Get(':id/detalles')
  @ApiOperation({ summary: 'Obtener solo los detalles de una devolución' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Detalles de la devolución' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findDetalles(@Param('id', ParseIntPipe) id: number) {
    return this.devolucionesService.findDetalles(id);
  }
}

