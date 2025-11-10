import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UsuarioRol } from './usuario-rol.entity';
import { RolPermiso } from './rol-permiso.entity';

@Entity('Roles')
export class Rol {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  Nombre: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  Descripcion?: string;

  @Column({ type: 'boolean', default: true })
  Activo: boolean;

  @CreateDateColumn({ name: 'FechaCreacion' })
  FechaCreacion: Date;

  @UpdateDateColumn({ name: 'FechaModificacion', nullable: true })
  FechaModificacion?: Date;

  // Relaciones
  @OneToMany(() => UsuarioRol, (usuarioRol) => usuarioRol.Rol)
  UsuariosRoles?: UsuarioRol[];

  @OneToMany(() => RolPermiso, (rolPermiso) => rolPermiso.Rol)
  RolesPermisos?: RolPermiso[];
}
