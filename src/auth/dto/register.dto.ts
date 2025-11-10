import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Nombre de usuario único',
    example: 'nuevo_usuario',
  })
  @IsNotEmpty({ message: 'El nombre de usuario es requerido' })
  @IsString()
  nombreUsuario: string;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'usuario@licoreria.com',
  })
  @IsNotEmpty({ message: 'El email es requerido' })
  @IsEmail({}, { message: 'El email debe ser válido' })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'Password123!',
    minLength: 6,
  })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
    required: false,
  })
  @IsOptional()
  @IsString()
  nombreCompleto?: string;

  @ApiProperty({
    description: 'Rol del usuario',
    example: 'Vendedor',
    required: false,
  })
  @IsOptional()
  @IsString()
  rol?: string;
}
