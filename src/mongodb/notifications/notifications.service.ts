import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './notification.schema';
import { CreateNotificationDto } from './dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const notification = new this.notificationModel({
      UsuarioId: createNotificationDto.usuarioId,
      Tipo: createNotificationDto.tipo,
      Titulo: createNotificationDto.titulo,
      Mensaje: createNotificationDto.mensaje,
      Nivel: createNotificationDto.nivel || 'info',
      Leida: false,
      Activa: true,
      Metadata: createNotificationDto.metadata || {},
    });

    return await notification.save();
  }

  async findAll(userId: number, soloNoLeidas: boolean = false, limit: number = 50) {
    const query: any = {
      UsuarioId: userId,
      Activa: true,
    };

    if (soloNoLeidas) {
      query.Leida = false;
    }

    const notifications = await this.notificationModel
      .find(query)
      .sort({ FechaCreacion: -1 })
      .limit(limit)
      .exec();

    return notifications;
  }

  async findOne(id: string) {
    const notification = await this.notificationModel.findById(id).exec();

    if (!notification) {
      throw new NotFoundException(`Notificación con ID ${id} no encontrada`);
    }

    return notification;
  }

  async marcarComoLeida(id: string) {
    const notification = await this.notificationModel.findByIdAndUpdate(
      id,
      {
        Leida: true,
        FechaLectura: new Date(),
      },
      { new: true },
    ).exec();

    if (!notification) {
      throw new NotFoundException(`Notificación con ID ${id} no encontrada`);
    }

    return notification;
  }

  async delete(id: string) {
    const notification = await this.notificationModel.findByIdAndUpdate(
      id,
      { Activa: false },
      { new: true },
    ).exec();

    if (!notification) {
      throw new NotFoundException(`Notificación con ID ${id} no encontrada`);
    }

    return { message: 'Notificación eliminada exitosamente' };
  }

  async contarNoLeidas(userId: number): Promise<number> {
    const count = await this.notificationModel
      .countDocuments({
        UsuarioId: userId,
        Leida: false,
        Activa: true,
      })
      .exec();

    return count;
  }
}

