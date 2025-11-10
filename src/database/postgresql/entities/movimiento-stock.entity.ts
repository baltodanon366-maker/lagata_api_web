import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DetalleProducto } from './detalle-producto.entity';
import { Usuario } from './usuario.entity';

@Entity('MovimientosStock')
export class MovimientoStock {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ name: 'DetalleProductoId' })
  DetalleProductoId: number;

  @Column({ type: 'varchar', length: 50 })
  TipoMovimiento: string; // Entrada, Salida, Ajuste

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  Cantidad: number;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  StockAnterior: number;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  StockNuevo: number;

  @Column({ type: 'integer', nullable: true })
  ReferenciaId?: number; // ID de Compra, Venta, Devolucion, etc.

  @Column({ type: 'varchar', length: 50, nullable: true })
  ReferenciaTipo?: string; // Compra, Venta, Devolucion, Ajuste

  @Column({ name: 'UsuarioId' })
  UsuarioId: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  Motivo?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  FechaMovimiento: Date;

  // Relaciones
  @ManyToOne(() => DetalleProducto, (detalle) => detalle.MovimientosStock)
  @JoinColumn({ name: 'DetalleProductoId' })
  DetalleProducto: DetalleProducto;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'UsuarioId' })
  Usuario: Usuario;
}
