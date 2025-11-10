import { IsNotEmpty, IsString, IsNumber, IsArray, ValidateNested, IsOptional, MaxLength, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class DetalleVentaDto {
  @ApiProperty({ description: 'ID del detalle producto', example: 1 })
  @IsNotEmpty({ message: 'El ID del detalle producto es requerido' })
  @IsNumber({}, { message: 'El ID del detalle producto debe ser un número' })
  DetalleProductoId: number;

  @ApiProperty({ description: 'Cantidad a vender', example: 5, type: Number })
  @IsNotEmpty({ message: 'La cantidad es requerida' })
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Min(0.01, { message: 'La cantidad debe ser mayor a 0' })
  Cantidad: number;

  @ApiProperty({ description: 'Precio unitario', example: 150.00, type: Number })
  @IsNotEmpty({ message: 'El precio unitario es requerido' })
  @IsNumber({}, { message: 'El precio unitario debe ser un número' })
  @Min(0, { message: 'El precio unitario debe ser mayor o igual a 0' })
  PrecioUnitario: number;

  @ApiProperty({ description: 'Descuento aplicado', example: 10.00, type: Number, required: false, default: 0 })
  @IsOptional()
  @IsNumber({}, { message: 'El descuento debe ser un número' })
  @Min(0, { message: 'El descuento debe ser mayor o igual a 0' })
  Descuento?: number;
}

export class CreateVentaDto {
  @ApiProperty({ description: 'Folio de la venta', example: 'VENT-2024-001', maxLength: 50 })
  @IsNotEmpty({ message: 'El folio es requerido' })
  @IsString({ message: 'El folio debe ser una cadena de texto' })
  @MaxLength(50, { message: 'El folio no puede exceder 50 caracteres' })
  folio: string;

  @ApiProperty({ description: 'Método de pago', example: 'Efectivo', maxLength: 50 })
  @IsNotEmpty({ message: 'El método de pago es requerido' })
  @IsString({ message: 'El método de pago debe ser una cadena de texto' })
  @MaxLength(50, { message: 'El método de pago no puede exceder 50 caracteres' })
  metodoPago: string;

  @ApiProperty({ description: 'Array de detalles de venta', type: [DetalleVentaDto] })
  @IsNotEmpty({ message: 'Los detalles de venta son requeridos' })
  @IsArray({ message: 'Los detalles deben ser un array' })
  @ValidateNested({ each: true })
  @Type(() => DetalleVentaDto)
  detallesVenta: DetalleVentaDto[];

  @ApiProperty({ description: 'ID del cliente', example: 1, required: false })
  @IsOptional()
  @IsNumber({}, { message: 'El ID del cliente debe ser un número' })
  clienteId?: number;

  @ApiProperty({ description: 'ID del empleado', example: 1, required: false })
  @IsOptional()
  @IsNumber({}, { message: 'El ID del empleado debe ser un número' })
  empleadoId?: number;

  @ApiProperty({ description: 'Fecha de venta', example: '2024-01-15T10:30:00', type: String, format: 'date-time', required: false })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de venta debe ser una fecha válida' })
  fechaVenta?: string;

  @ApiProperty({ description: 'Observaciones', example: 'Venta al contado', maxLength: 1000, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  observaciones?: string;
}

