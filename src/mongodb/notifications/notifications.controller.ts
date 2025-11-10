import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
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
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { MongoDbGuard } from '../../common/guards/mongodb.guard';

@ApiTags('MongoDB - Notificaciones')
@Controller('mongodb/notificaciones')
@UseGuards(JwtAuthGuard, MongoDbGuard)
@ApiBearerAuth('JWT-auth')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva notificación' })
  @ApiResponse({ status: 201, description: 'Notificación creada exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 503, description: 'MongoDB no disponible' })
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar notificaciones del usuario autenticado' })
  @ApiQuery({ name: 'soloNoLeidas', required: false, type: Boolean, example: false })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({ status: 200, description: 'Lista de notificaciones' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 503, description: 'MongoDB no disponible' })
  findAll(
    @Request() req,
    @Query('soloNoLeidas') soloNoLeidas: string = 'false',
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    const soloNoLeidasBool = soloNoLeidas === 'true';
    return this.notificationsService.findAll(req.user.id, soloNoLeidasBool, limit || 50);
  }

  @Get('contar-no-leidas')
  @ApiOperation({ summary: 'Contar notificaciones no leídas del usuario' })
  @ApiResponse({ status: 200, description: 'Cantidad de notificaciones no leídas' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 503, description: 'MongoDB no disponible' })
  contarNoLeidas(@Request() req) {
    return this.notificationsService.contarNoLeidas(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una notificación por ID' })
  @ApiParam({ name: 'id', type: String, example: '507f1f77bcf86cd799439011' })
  @ApiResponse({ status: 200, description: 'Notificación encontrada' })
  @ApiResponse({ status: 404, description: 'Notificación no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 503, description: 'MongoDB no disponible' })
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id/leer')
  @ApiOperation({ summary: 'Marcar una notificación como leída' })
  @ApiParam({ name: 'id', type: String, example: '507f1f77bcf86cd799439011' })
  @ApiResponse({ status: 200, description: 'Notificación marcada como leída' })
  @ApiResponse({ status: 404, description: 'Notificación no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 503, description: 'MongoDB no disponible' })
  marcarComoLeida(@Param('id') id: string) {
    return this.notificationsService.marcarComoLeida(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una notificación (marcar como inactiva)' })
  @ApiParam({ name: 'id', type: String, example: '507f1f77bcf86cd799439011' })
  @ApiResponse({ status: 200, description: 'Notificación eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Notificación no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 503, description: 'MongoDB no disponible' })
  delete(@Param('id') id: string) {
    return this.notificationsService.delete(id);
  }
}

