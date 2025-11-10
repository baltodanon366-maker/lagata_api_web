import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Empleado } from './empleado.entity';
import { SesionUsuario } from './sesion-usuario.entity';
import { UsuarioRol } from './usuario-rol.entity';

@Entity('Usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  NombreUsuario: string;

  @Column({ type: 'varchar', length: 200, unique: true })
  Email: string;

  @Column({ type: 'text' })
  PasswordHash: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  NombreCompleto?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  Rol?: string; // Mantener por compatibilidad

  @Column({ type: 'boolean', default: true })
  Activo: boolean;

  @CreateDateColumn({ name: 'FechaCreacion' })
  FechaCreacion: Date;

  @UpdateDateColumn({ name: 'FechaModificacion', nullable: true })
  FechaModificacion?: Date;

  @Column({ type: 'timestamp', nullable: true })
  UltimoAcceso?: Date;

  // Relaciones
  @OneToMany(() => Empleado, (empleado) => empleado.Usuario)
  Empleados?: Empleado[];

  @OneToMany(() => SesionUsuario, (sesion) => sesion.Usuario)
  Sesiones?: SesionUsuario[];

  @OneToMany(() => UsuarioRol, (usuarioRol) => usuarioRol.Usuario)
  UsuariosRoles?: UsuarioRol[];
}
