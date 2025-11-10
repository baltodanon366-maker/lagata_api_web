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
import { DimCategoria } from './dim-categoria.entity';

@Entity('HechoInventario')
export class HechoInventario {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ name: 'FechaId' })
  FechaId: number;

  @Column({ name: 'ProductoId' })
  ProductoId: number;

  @Column({ name: 'CategoriaId', nullable: true })
  CategoriaId?: number;

  @Column({ type: 'integer' })
  StockActual: number;

  @Column({ type: 'integer' })
  StockMinimo: number;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  ValorInventario: number;

  @Column({ type: 'integer', default: 0 })
  ProductosConStockBajo: number;

  @CreateDateColumn({ name: 'FechaProcesamiento' })
  FechaProcesamiento: Date;

  // Relaciones
  @ManyToOne(() => DimTiempo, (tiempo) => tiempo.HechosInventario)
  @JoinColumn({ name: 'FechaId' })
  Fecha: DimTiempo;

  @ManyToOne(() => DimProducto, (producto) => producto.HechosInventario)
  @JoinColumn({ name: 'ProductoId' })
  Producto: DimProducto;

  @ManyToOne(() => DimCategoria, (categoria) => categoria.HechosInventario)
  @JoinColumn({ name: 'CategoriaId' })
  Categoria?: DimCategoria;
}
