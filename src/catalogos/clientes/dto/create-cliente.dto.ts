import {
  IsNotEmpty,
  IsString,
  IsOptional,
  MaxLength,
  IsEmail,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClienteDto {
  @ApiProperty({
    description: 'Código único del cliente',
    example: 'CLI001',
    maxLength: 50,
  })
  @IsNotEmpty({ message: 'El código del cliente es requerido' })
  @IsString()
  @MaxLength(50)
  codigoCliente: string;

  @ApiProperty({
    description: 'Nombre completo',
    example: 'Juan Pérez',
    maxLength: 200,
  })
  @IsNotEmpty({ message: 'El nombre completo es requerido' })
  @IsString()
  @MaxLength(200)
  nombreCompleto: string;

  @ApiProperty({
    description: 'Razón social',
    example: 'Empresa XYZ S.A. de C.V.',
    maxLength: 300,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  razonSocial?: string;

  @ApiProperty({
    description: 'RFC',
    example: 'XYZ123456789',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  rfc?: string;

  @ApiProperty({
    description: 'Dirección',
    example: 'Calle Principal 456',
    maxLength: 500,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  direccion?: string;

  @ApiProperty({
    description: 'Teléfono',
    example: '5559876543',
    maxLength: 20,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string;

  @ApiProperty({
    description: 'Email',
    example: 'cliente@email.com',
    maxLength: 200,
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'El email debe ser válido' })
  @MaxLength(200)
  email?: string;
}
