import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DimTiempo } from './dim-tiempo.entity';
import { DimProducto } from './dim-producto.entity';
import { DimProveedor } from './dim-proveedor.entity';
import { DimCategoria } from './dim-categoria.entity';

@Entity('HechoCompra')
export class HechoCompra {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ name: 'FechaId' })
  FechaId: number;

  @Column({ name: 'ProductoId' })
  ProductoId: number;

  @Column({ name: 'ProveedorId' })
  ProveedorId: number;

  @Column({ name: 'CategoriaId', nullable: true })
  CategoriaId?: number;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  TotalCompras: number;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  CantidadComprada: number;

  @Column({ type: 'integer' })
  CantidadTransacciones: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
  PromedioCompra?: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, default: 0 })
  ImpuestosTotal: number;

  @CreateDateColumn({ name: 'FechaProcesamiento' })
  FechaProcesamiento: Date;

  // Relaciones
  @ManyToOne(() => DimTiempo, (tiempo) => tiempo.HechosCompra)
  @JoinColumn({ name: 'FechaId' })
  Fecha: DimTiempo;

  @ManyToOne(() => DimProducto, (producto) => producto.HechosCompra)
  @JoinColumn({ name: 'ProductoId' })
  Producto: DimProducto;

  @ManyToOne(() => DimProveedor, (proveedor) => proveedor.HechosCompra)
  @JoinColumn({ name: 'ProveedorId' })
  Proveedor: DimProveedor;

  @ManyToOne(() => DimCategoria, (categoria) => categoria.HechosCompra)
  @JoinColumn({ name: 'CategoriaId' })
  Categoria?: DimCategoria;
}
