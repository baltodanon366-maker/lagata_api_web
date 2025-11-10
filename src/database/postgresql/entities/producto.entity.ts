import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { DetalleProducto } from './detalle-producto.entity';

@Entity('Productos')
export class Producto {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'varchar', length: 200 })
  Nombre: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  Descripcion?: string;

  @Column({ type: 'boolean', default: true })
  Activo: boolean;

  @CreateDateColumn({ name: 'FechaCreacion' })
  FechaCreacion: Date;

  @UpdateDateColumn({ name: 'FechaModificacion', nullable: true })
  FechaModificacion?: Date;

  // Relaciones
  @OneToMany(() => DetalleProducto, (detalle) => detalle.Producto)
  DetallesProducto?: DetalleProducto[];
}
