import {
  IsNotEmpty,
  IsString,
  IsOptional,
  MaxLength,
  IsNumber,
  Min,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDetalleProductoDto {
  @ApiProperty({ description: 'ID de la categoría', example: 1 })
  @IsNotEmpty({ message: 'El ID de la categoría es requerido' })
  @IsNumber({}, { message: 'El ID de la categoría debe ser un número' })
  @IsInt({ message: 'El ID de la categoría debe ser un entero' })
  categoriaId: number;

  @ApiProperty({ description: 'ID de la marca', example: 1 })
  @IsNotEmpty({ message: 'El ID de la marca es requerido' })
  @IsNumber({}, { message: 'El ID de la marca debe ser un número' })
  @IsInt({ message: 'El ID de la marca debe ser un entero' })
  marcaId: number;

  @ApiProperty({ description: 'ID del modelo', example: 1 })
  @IsNotEmpty({ message: 'El ID del modelo es requerido' })
  @IsNumber({}, { message: 'El ID del modelo debe ser un número' })
  @IsInt({ message: 'El ID del modelo debe ser un entero' })
  modeloId: number;

  @ApiProperty({
    description: 'Precio de compra',
    example: 100.0,
    type: Number,
  })
  @IsNotEmpty({ message: 'El precio de compra es requerido' })
  @IsNumber({}, { message: 'El precio de compra debe ser un número' })
  @Min(0, { message: 'El precio de compra debe ser mayor o igual a 0' })
  precioCompra: number;

  @ApiProperty({ description: 'Precio de venta', example: 150.0, type: Number })
  @IsNotEmpty({ message: 'El precio de venta es requerido' })
  @IsNumber({}, { message: 'El precio de venta debe ser un número' })
  @Min(0, { message: 'El precio de venta debe ser mayor o igual a 0' })
  precioVenta: number;

  @ApiProperty({
    description: 'SKU',
    example: 'SKU123456',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  sku?: string;

  @ApiProperty({
    description: 'Observaciones',
    example: 'Producto actualizado',
    maxLength: 500,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  observaciones?: string;

  @ApiProperty({
    description: 'Stock mínimo',
    example: 10,
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El stock mínimo debe ser un número' })
  @IsInt({ message: 'El stock mínimo debe ser un entero' })
  @Min(0, { message: 'El stock mínimo debe ser mayor o igual a 0' })
  stockMinimo?: number;

  @ApiProperty({
    description: 'Unidad de medida',
    example: 'Litro',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  unidadMedida?: string;
}
