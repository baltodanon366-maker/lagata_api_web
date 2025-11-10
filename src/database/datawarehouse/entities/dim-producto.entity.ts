import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { DimCategoria } from './dim-categoria.entity';
import { DimMarca } from './dim-marca.entity';
import { DimModelo } from './dim-modelo.entity';
import { HechoVenta } from './hecho-venta.entity';
import { HechoCompra } from './hecho-compra.entity';
import { HechoInventario } from './hecho-inventario.entity';

@Entity('DimProducto')
export class DimProducto {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  ProductoCodigo: string;

  @Column({ type: 'varchar', length: 200 })
  ProductoNombre: string;

  @Column({ name: 'CategoriaId', nullable: true })
  CategoriaId?: number;

  @Column({ name: 'MarcaId', nullable: true })
  MarcaId?: number;

  @Column({ name: 'ModeloId', nullable: true })
  ModeloId?: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
  PrecioCompraPromedio?: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
  PrecioVentaPromedio?: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  UnidadMedida?: string;

  @Column({ type: 'boolean', default: true })
  Activo: boolean;

  @CreateDateColumn({ name: 'FechaInicio' })
  FechaInicio: Date;

  @Column({ type: 'timestamp', nullable: true })
  FechaFin?: Date;

  // Relaciones
  @ManyToOne(() => DimCategoria, (categoria) => categoria.Productos)
  @JoinColumn({ name: 'CategoriaId' })
  Categoria?: DimCategoria;

  @ManyToOne(() => DimMarca, (marca) => marca.Productos)
  @JoinColumn({ name: 'MarcaId' })
  Marca?: DimMarca;

  @ManyToOne(() => DimModelo, (modelo) => modelo.Productos)
  @JoinColumn({ name: 'ModeloId' })
  Modelo?: DimModelo;

  @OneToMany(() => HechoVenta, (hecho) => hecho.Producto)
  HechosVenta?: HechoVenta[];

  @OneToMany(() => HechoCompra, (hecho) => hecho.Producto)
  HechosCompra?: HechoCompra[];

  @OneToMany(() => HechoInventario, (hecho) => hecho.Producto)
  HechosInventario?: HechoInventario[];
}
