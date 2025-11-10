import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DevolucionVenta } from './devolucion-venta.entity';
import { VentaDetalle } from './venta-detalle.entity';
import { DetalleProducto } from './detalle-producto.entity';

@Entity('DevolucionesVentaDetalle')
export class DevolucionVentaDetalle {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ name: 'DevolucionVentaId' })
  DevolucionVentaId: number;

  @Column({ name: 'VentaDetalleId' })
  VentaDetalleId: number;

  @Column({ name: 'DetalleProductoId' })
  DetalleProductoId: number;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  CantidadDevolver: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  Motivo?: string;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  Subtotal: number;

  // Relaciones
  @ManyToOne(() => DevolucionVenta, (devolucion) => devolucion.Detalles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'DevolucionVentaId' })
  DevolucionVenta: DevolucionVenta;

  @ManyToOne(
    () => VentaDetalle,
    (ventaDetalle) => ventaDetalle.DevolucionesDetalle,
  )
  @JoinColumn({ name: 'VentaDetalleId' })
  VentaDetalle: VentaDetalle;

  @ManyToOne(() => DetalleProducto)
  @JoinColumn({ name: 'DetalleProductoId' })
  DetalleProducto: DetalleProducto;
}
