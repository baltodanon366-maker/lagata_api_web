import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Compra } from './compra.entity';
import { DetalleProducto } from './detalle-producto.entity';

@Entity('ComprasDetalle')
export class CompraDetalle {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ name: 'CompraId' })
  CompraId: number;

  @Column({ name: 'DetalleProductoId' })
  DetalleProductoId: number;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  Cantidad: number;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  PrecioUnitario: number;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  Subtotal: number;

  // Relaciones
  @ManyToOne(() => Compra, (compra) => compra.Detalles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'CompraId' })
  Compra: Compra;

  @ManyToOne(() => DetalleProducto, (detalle) => detalle.ComprasDetalle)
  @JoinColumn({ name: 'DetalleProductoId' })
  DetalleProducto: DetalleProducto;
}
