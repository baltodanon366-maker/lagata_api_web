import {
  IsNotEmpty,
  IsString,
  IsOptional,
  MaxLength,
  IsEmail,
  IsNumber,
  IsDateString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEmpleadoDto {
  @ApiProperty({
    description: 'Nombre completo',
    example: 'María González Actualizada',
    maxLength: 200,
  })
  @IsNotEmpty({ message: 'El nombre completo es requerido' })
  @IsString()
  @MaxLength(200)
  nombreCompleto: string;

  @ApiProperty({
    description: 'Fecha de ingreso',
    example: '2024-01-15',
    type: String,
    format: 'date',
  })
  @IsNotEmpty({ message: 'La fecha de ingreso es requerida' })
  @IsDateString(
    {},
    { message: 'La fecha de ingreso debe ser una fecha válida' },
  )
  fechaIngreso: string;

  @ApiProperty({
    description: 'ID del usuario asociado',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El ID del usuario debe ser un número' })
  usuarioId?: number;

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
    example: 'empleado@email.com',
    maxLength: 200,
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'El email debe ser válido' })
  @MaxLength(200)
  email?: string;

  @ApiProperty({
    description: 'Dirección',
    example: 'Calle Empleado 789',
    maxLength: 500,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  direccion?: string;

  @ApiProperty({
    description: 'Fecha de nacimiento',
    example: '1990-05-20',
    type: String,
    format: 'date',
    required: false,
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'La fecha de nacimiento debe ser una fecha válida' },
  )
  fechaNacimiento?: string;

  @ApiProperty({
    description: 'Salario',
    example: 15000.0,
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El salario debe ser un número' })
  @Min(0, { message: 'El salario debe ser mayor o igual a 0' })
  salario?: number;

  @ApiProperty({
    description: 'Departamento',
    example: 'Ventas',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  departamento?: string;

  @ApiProperty({
    description: 'Puesto',
    example: 'Vendedor',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  puesto?: string;
}
