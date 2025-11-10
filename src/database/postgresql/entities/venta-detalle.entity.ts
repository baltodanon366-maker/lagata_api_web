import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Venta } from './venta.entity';
import { DetalleProducto } from './detalle-producto.entity';
import { DevolucionVentaDetalle } from './devolucion-venta-detalle.entity';

@Entity('VentasDetalle')
export class VentaDetalle {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ name: 'VentaId' })
  VentaId: number;

  @Column({ name: 'DetalleProductoId' })
  DetalleProductoId: number;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  Cantidad: number;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  PrecioUnitario: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, default: 0 })
  Descuento: number;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  Subtotal: number;

  // Relaciones
  @ManyToOne(() => Venta, (venta) => venta.Detalles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'VentaId' })
  Venta: Venta;

  @ManyToOne(() => DetalleProducto, (detalle) => detalle.VentasDetalle)
  @JoinColumn({ name: 'DetalleProductoId' })
  DetalleProducto: DetalleProducto;

  @OneToMany(
    () => DevolucionVentaDetalle,
    (devolucion) => devolucion.VentaDetalle,
  )
  DevolucionesDetalle?: DevolucionVentaDetalle[];
}
