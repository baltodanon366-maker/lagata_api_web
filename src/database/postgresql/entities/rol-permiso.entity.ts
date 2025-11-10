import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Rol } from './rol.entity';
import { Permiso } from './permiso.entity';

@Entity('RolesPermisos')
export class RolPermiso {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ name: 'RolId' })
  RolId: number;

  @Column({ name: 'PermisoId' })
  PermisoId: number;

  @CreateDateColumn({ name: 'FechaCreacion' })
  FechaCreacion: Date;

  // Relaciones
  @ManyToOne(() => Rol, (rol) => rol.RolesPermisos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'RolId' })
  Rol: Rol;

  @ManyToOne(() => Permiso, (permiso) => permiso.RolesPermisos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'PermisoId' })
  Permiso: Permiso;
}
