import { IsNotEmpty, IsString, IsNumber, IsArray, ValidateNested, IsOptional, MaxLength, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class DetalleDevolucionDto {
  @ApiProperty({ description: 'ID del detalle de venta original', example: 1 })
  @IsNotEmpty({ message: 'El ID del detalle de venta es requerido' })
  @IsNumber({}, { message: 'El ID del detalle de venta debe ser un número' })
  VentaDetalleId: number;

  @ApiProperty({ description: 'ID del detalle producto', example: 1 })
  @IsNotEmpty({ message: 'El ID del detalle producto es requerido' })
  @IsNumber({}, { message: 'El ID del detalle producto debe ser un número' })
  DetalleProductoId: number;

  @ApiProperty({ description: 'Cantidad a devolver', example: 2, type: Number })
  @IsNotEmpty({ message: 'La cantidad a devolver es requerida' })
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Min(0.01, { message: 'La cantidad debe ser mayor a 0' })
  CantidadDevolver: number;

  @ApiProperty({ description: 'Motivo de la devolución', example: 'Producto defectuoso', maxLength: 500, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  Motivo?: string;
}

export class CreateDevolucionDto {
  @ApiProperty({ description: 'Folio de la devolución', example: 'DEV-2024-001', maxLength: 50 })
  @IsNotEmpty({ message: 'El folio es requerido' })
  @IsString({ message: 'El folio debe ser una cadena de texto' })
  @MaxLength(50, { message: 'El folio no puede exceder 50 caracteres' })
  folio: string;

  @ApiProperty({ description: 'ID de la venta original', example: 1 })
  @IsNotEmpty({ message: 'El ID de la venta es requerido' })
  @IsNumber({}, { message: 'El ID de la venta debe ser un número' })
  ventaId: number;

  @ApiProperty({ description: 'Motivo general de la devolución', example: 'Productos defectuosos', maxLength: 500 })
  @IsNotEmpty({ message: 'El motivo es requerido' })
  @IsString({ message: 'El motivo debe ser una cadena de texto' })
  @MaxLength(500, { message: 'El motivo no puede exceder 500 caracteres' })
  motivo: string;

  @ApiProperty({ description: 'Array de detalles de devolución', type: [DetalleDevolucionDto] })
  @IsNotEmpty({ message: 'Los detalles de devolución son requeridos' })
  @IsArray({ message: 'Los detalles deben ser un array' })
  @ValidateNested({ each: true })
  @Type(() => DetalleDevolucionDto)
  detallesDevolucion: DetalleDevolucionDto[];

  @ApiProperty({ description: 'Fecha de devolución', example: '2024-01-15T10:30:00', type: String, format: 'date-time', required: false })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de devolución debe ser una fecha válida' })
  fechaDevolucion?: string;

  @ApiProperty({ description: 'Observaciones', example: 'Devolución completa', maxLength: 1000, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  observaciones?: string;
}

