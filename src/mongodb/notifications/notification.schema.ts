import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true, collection: 'notifications' })
export class Notification {
  @Prop({ required: true })
  UsuarioId: number;

  @Prop({ required: true, type: String })
  Tipo: string; // 'Sistema', 'Venta', 'Compra', 'Stock', 'Alerta', etc.

  @Prop({ required: true })
  Titulo: string;

  @Prop({ required: true })
  Mensaje: string;

  @Prop({ type: String, enum: ['info', 'warning', 'error', 'success'], default: 'info' })
  Nivel?: string;

  @Prop({ default: false })
  Leida: boolean;

  @Prop({ type: Date, default: Date.now })
  FechaCreacion: Date;

  @Prop({ type: Date })
  FechaLectura?: Date;

  @Prop({ type: Object })
  Metadata?: Record<string, any>; // Datos adicionales (ID de venta, compra, etc.)

  @Prop({ default: true })
  Activa: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

// Índices para mejorar búsquedas
NotificationSchema.index({ UsuarioId: 1, Leida: 1 });
NotificationSchema.index({ FechaCreacion: -1 });
NotificationSchema.index({ Tipo: 1 });

