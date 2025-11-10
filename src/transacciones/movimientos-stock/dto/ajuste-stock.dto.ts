import { IsNotEmpty, IsNumber, IsString, IsOptional, MaxLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AjusteStockDto {
  @ApiProperty({ description: 'ID del detalle producto', example: 1 })
  @IsNotEmpty({ message: 'El ID del detalle producto es requerido' })
  @IsNumber({}, { message: 'El ID del detalle producto debe ser un número' })
  detalleProductoId: number;

  @ApiProperty({ 
    description: 'Cantidad a ajustar (positivo para aumentar, negativo para disminuir)', 
    example: 10, 
    type: Number 
  })
  @IsNotEmpty({ message: 'La cantidad es requerida' })
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  cantidad: number;

  @ApiProperty({ description: 'Motivo del ajuste', example: 'Ajuste por inventario físico', maxLength: 500 })
  @IsNotEmpty({ message: 'El motivo es requerido' })
  @IsString({ message: 'El motivo debe ser una cadena de texto' })
  @MaxLength(500, { message: 'El motivo no puede exceder 500 caracteres' })
  motivo: string;
}

