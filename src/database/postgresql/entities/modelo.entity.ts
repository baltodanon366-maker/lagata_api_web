import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { DetalleProducto } from './detalle-producto.entity';

@Entity('Modelos')
export class Modelo {
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
  @OneToMany(() => DetalleProducto, (detalle) => detalle.Modelo)
  DetallesProducto?: DetalleProducto[];
}
