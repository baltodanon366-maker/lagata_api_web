import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { RolPermiso } from './rol-permiso.entity';

@Entity('Permisos')
export class Permiso {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  Nombre: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  Descripcion?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  Modulo?: string; // Ventas, Compras, Inventario, etc.

  @Column({ type: 'boolean', default: true })
  Activo: boolean;

  @CreateDateColumn({ name: 'FechaCreacion' })
  FechaCreacion: Date;

  // Relaciones
  @OneToMany(() => RolPermiso, (rolPermiso) => rolPermiso.Permiso)
  RolesPermisos?: RolPermiso[];
}
