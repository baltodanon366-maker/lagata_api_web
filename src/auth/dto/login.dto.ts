import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Nombre de usuario o email',
    example: 'admin',
  })
  @IsNotEmpty({ message: 'El nombre de usuario o email es requerido' })
  @IsString()
  nombreUsuario: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'Admin123!',
    minLength: 6,
  })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;
}
