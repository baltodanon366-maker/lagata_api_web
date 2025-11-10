import { IsNotEmpty, IsString, IsNumber, IsArray, ValidateNested, IsOptional, MaxLength, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class DetalleCompraDto {
  @ApiProperty({ description: 'ID del detalle producto', example: 1 })
  @IsNotEmpty({ message: 'El ID del detalle producto es requerido' })
  @IsNumber({}, { message: 'El ID del detalle producto debe ser un número' })
  DetalleProductoId: number;

  @ApiProperty({ description: 'Cantidad a comprar', example: 10, type: Number })
  @IsNotEmpty({ message: 'La cantidad es requerida' })
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Min(0.01, { message: 'La cantidad debe ser mayor a 0' })
  Cantidad: number;

  @ApiProperty({ description: 'Precio unitario', example: 100.00, type: Number })
  @IsNotEmpty({ message: 'El precio unitario es requerido' })
  @IsNumber({}, { message: 'El precio unitario debe ser un número' })
  @Min(0, { message: 'El precio unitario debe ser mayor o igual a 0' })
  PrecioUnitario: number;
}

export class CreateCompraDto {
  @ApiProperty({ description: 'Folio de la compra', example: 'COMP-2024-001', maxLength: 50 })
  @IsNotEmpty({ message: 'El folio es requerido' })
  @IsString({ message: 'El folio debe ser una cadena de texto' })
  @MaxLength(50, { message: 'El folio no puede exceder 50 caracteres' })
  folio: string;

  @ApiProperty({ description: 'ID del proveedor', example: 1 })
  @IsNotEmpty({ message: 'El ID del proveedor es requerido' })
  @IsNumber({}, { message: 'El ID del proveedor debe ser un número' })
  proveedorId: number;

  @ApiProperty({ description: 'Array de detalles de compra', type: [DetalleCompraDto] })
  @IsNotEmpty({ message: 'Los detalles de compra son requeridos' })
  @IsArray({ message: 'Los detalles deben ser un array' })
  @ValidateNested({ each: true })
  @Type(() => DetalleCompraDto)
  detallesCompra: DetalleCompraDto[];

  @ApiProperty({ description: 'Fecha de compra', example: '2024-01-15T10:30:00', type: String, format: 'date-time', required: false })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de compra debe ser una fecha válida' })
  fechaCompra?: string;

  @ApiProperty({ description: 'Observaciones', example: 'Compra de productos para inventario', maxLength: 1000, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  observaciones?: string;
}

