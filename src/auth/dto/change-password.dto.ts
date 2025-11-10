import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Contraseña actual',
    example: 'PasswordActual123!',
  })
  @IsNotEmpty({ message: 'La contraseña actual es requerida' })
  @IsString()
  passwordActual: string;

  @ApiProperty({
    description: 'Nueva contraseña',
    example: 'NuevaPassword123!',
    minLength: 6,
  })
  @IsNotEmpty({ message: 'La nueva contraseña es requerida' })
  @IsString()
  @MinLength(6, {
    message: 'La nueva contraseña debe tener al menos 6 caracteres',
  })
  nuevaPassword: string;
}
