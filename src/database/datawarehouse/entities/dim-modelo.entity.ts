import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { DimProducto } from './dim-producto.entity';

@Entity('DimModelo')
export class DimModelo {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  ModeloNombre: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  Descripcion?: string;

  @Column({ type: 'boolean', default: true })
  Activo: boolean;

  // Relaciones
  @OneToMany(() => DimProducto, (producto) => producto.Modelo)
  Productos?: DimProducto[];
}
