import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Compra } from './compra.entity';

@Entity('Proveedores')
export class Proveedor {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  CodigoProveedor: string;

  @Column({ type: 'varchar', length: 200 })
  Nombre: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  RazonSocial?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  RFC?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  Direccion?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  Telefono?: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  Email?: string;

  @Column({ type: 'boolean', default: true })
  Activo: boolean;

  @CreateDateColumn({ name: 'FechaCreacion' })
  FechaCreacion: Date;

  @UpdateDateColumn({ name: 'FechaModificacion', nullable: true })
  FechaModificacion?: Date;

  // Relaciones
  @OneToMany(() => Compra, (compra) => compra.Proveedor)
  Compras?: Compra[];
}
