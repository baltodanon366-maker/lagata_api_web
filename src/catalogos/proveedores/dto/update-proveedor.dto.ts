import {
  IsNotEmpty,
  IsString,
  IsOptional,
  MaxLength,
  IsEmail,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProveedorDto {
  @ApiProperty({
    description: 'Nombre del proveedor',
    example: 'Distribuidora ABC Actualizada',
    maxLength: 200,
  })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(200, { message: 'El nombre no puede exceder 200 caracteres' })
  nombre: string;

  @ApiProperty({
    description: 'Razón social',
    example: 'Distribuidora ABC S.A. de C.V.',
    maxLength: 300,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  razonSocial?: string;

  @ApiProperty({
    description: 'RFC',
    example: 'ABC123456789',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  rfc?: string;

  @ApiProperty({
    description: 'Dirección',
    example: 'Calle Principal 123',
    maxLength: 500,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  direccion?: string;

  @ApiProperty({
    description: 'Teléfono',
    example: '5551234567',
    maxLength: 20,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string;

  @ApiProperty({
    description: 'Email',
    example: 'contacto@proveedor.com',
    maxLength: 200,
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'El email debe ser válido' })
  @MaxLength(200)
  email?: string;
}
