import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Cliente } from './cliente.entity';
import { Usuario } from './usuario.entity';
import { Empleado } from './empleado.entity';
import { VentaDetalle } from './venta-detalle.entity';
import { DevolucionVenta } from './devolucion-venta.entity';

@Entity('Ventas')
export class Venta {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  Folio: string;

  @Column({ name: 'ClienteId', nullable: true })
  ClienteId?: number;

  @Column({ name: 'UsuarioId' })
  UsuarioId: number;

  @Column({ name: 'EmpleadoId', nullable: true })
  EmpleadoId?: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  FechaVenta: Date;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  Subtotal: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, default: 0 })
  Impuestos: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, default: 0 })
  Descuento: number;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  Total: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  MetodoPago?: string;

  @Column({ type: 'varchar', length: 50, default: 'Completada' })
  Estado: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  Observaciones?: string;

  @CreateDateColumn({ name: 'FechaCreacion' })
  FechaCreacion: Date;

  @UpdateDateColumn({ name: 'FechaModificacion', nullable: true })
  FechaModificacion?: Date;

  // Relaciones
  @ManyToOne(() => Cliente, (cliente) => cliente.Ventas)
  @JoinColumn({ name: 'ClienteId' })
  Cliente?: Cliente;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'UsuarioId' })
  Usuario: Usuario;

  @ManyToOne(() => Empleado, (empleado) => empleado.Ventas)
  @JoinColumn({ name: 'EmpleadoId' })
  Empleado?: Empleado;

  @OneToMany(() => VentaDetalle, (detalle) => detalle.Venta, {
    cascade: true,
  })
  Detalles: VentaDetalle[];

  @OneToMany(() => DevolucionVenta, (devolucion) => devolucion.Venta)
  Devoluciones?: DevolucionVenta[];
}
