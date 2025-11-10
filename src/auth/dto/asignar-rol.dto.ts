import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AsignarRolDto {
  @ApiProperty({
    description: 'ID del usuario al que se le asignará el rol',
    example: 2,
  })
  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  @IsNumber({}, { message: 'El ID del usuario debe ser un número' })
  usuarioId: number;

  @ApiProperty({
    description: 'ID del rol a asignar',
    example: 1,
  })
  @IsNotEmpty({ message: 'El ID del rol es requerido' })
  @IsNumber({}, { message: 'El ID del rol debe ser un número' })
  rolId: number;
}
