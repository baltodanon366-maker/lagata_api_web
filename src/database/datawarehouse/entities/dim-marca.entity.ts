import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { DimProducto } from './dim-producto.entity';

@Entity('DimMarca')
export class DimMarca {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  MarcaNombre: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  Descripcion?: string;

  @Column({ type: 'boolean', default: true })
  Activo: boolean;

  // Relaciones
  @OneToMany(() => DimProducto, (producto) => producto.Marca)
  Productos?: DimProducto[];
}
