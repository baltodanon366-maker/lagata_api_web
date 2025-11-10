import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum, IsObject, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({ description: 'ID del usuario destinatario', example: 1 })
  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  @IsNumber({}, { message: 'El ID del usuario debe ser un número' })
  usuarioId: number;

  @ApiProperty({ 
    description: 'Tipo de notificación', 
    example: 'Sistema',
    enum: ['Sistema', 'Venta', 'Compra', 'Stock', 'Alerta', 'Devolucion'],
  })
  @IsNotEmpty({ message: 'El tipo es requerido' })
  @IsString({ message: 'El tipo debe ser una cadena de texto' })
  @IsEnum(['Sistema', 'Venta', 'Compra', 'Stock', 'Alerta', 'Devolucion'], {
    message: 'El tipo debe ser uno de: Sistema, Venta, Compra, Stock, Alerta, Devolucion',
  })
  tipo: string;

  @ApiProperty({ description: 'Título de la notificación', example: 'Stock bajo', maxLength: 200 })
  @IsNotEmpty({ message: 'El título es requerido' })
  @IsString({ message: 'El título debe ser una cadena de texto' })
  @MaxLength(200, { message: 'El título no puede exceder 200 caracteres' })
  titulo: string;

  @ApiProperty({ description: 'Mensaje de la notificación', example: 'El producto X tiene stock bajo', maxLength: 1000 })
  @IsNotEmpty({ message: 'El mensaje es requerido' })
  @IsString({ message: 'El mensaje debe ser una cadena de texto' })
  @MaxLength(1000, { message: 'El mensaje no puede exceder 1000 caracteres' })
  mensaje: string;

  @ApiProperty({ 
    description: 'Nivel de la notificación', 
    example: 'info',
    enum: ['info', 'warning', 'error', 'success'],
    required: false,
    default: 'info',
  })
  @IsOptional()
  @IsEnum(['info', 'warning', 'error', 'success'], {
    message: 'El nivel debe ser uno de: info, warning, error, success',
  })
  nivel?: string;

  @ApiProperty({ 
    description: 'Datos adicionales (metadata)', 
    example: { ventaId: 123, total: 1500.00 },
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

