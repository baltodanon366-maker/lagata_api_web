import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { DimProducto } from './dim-producto.entity';
import { HechoVenta } from './hecho-venta.entity';
import { HechoCompra } from './hecho-compra.entity';
import { HechoInventario } from './hecho-inventario.entity';

@Entity('DimCategoria')
export class DimCategoria {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  CategoriaNombre: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  Descripcion?: string;

  @Column({ type: 'boolean', default: true })
  Activo: boolean;

  // Relaciones
  @OneToMany(() => DimProducto, (producto) => producto.Categoria)
  Productos?: DimProducto[];

  @OneToMany(() => HechoVenta, (hecho) => hecho.Categoria)
  HechosVenta?: HechoVenta[];

  @OneToMany(() => HechoCompra, (hecho) => hecho.Categoria)
  HechosCompra?: HechoCompra[];

  @OneToMany(() => HechoInventario, (hecho) => hecho.Categoria)
  HechosInventario?: HechoInventario[];
}
