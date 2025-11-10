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
import { Venta } from './venta.entity';
import { Usuario } from './usuario.entity';
import { DevolucionVentaDetalle } from './devolucion-venta-detalle.entity';

@Entity('DevolucionesVenta')
export class DevolucionVenta {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  Folio: string;

  @Column({ name: 'VentaId' })
  VentaId: number;

  @Column({ name: 'UsuarioId' })
  UsuarioId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  FechaDevolucion: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  Motivo?: string;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  TotalDevolucion: number;

  @Column({ type: 'varchar', length: 50, default: 'Pendiente' })
  Estado: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  Observaciones?: string;

  @CreateDateColumn({ name: 'FechaCreacion' })
  FechaCreacion: Date;

  @UpdateDateColumn({ name: 'FechaModificacion', nullable: true })
  FechaModificacion?: Date;

  // Relaciones
  @ManyToOne(() => Venta, (venta) => venta.Devoluciones)
  @JoinColumn({ name: 'VentaId' })
  Venta: Venta;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'UsuarioId' })
  Usuario: Usuario;

  @OneToMany(
    () => DevolucionVentaDetalle,
    (detalle) => detalle.DevolucionVenta,
    {
      cascade: true,
    },
  )
  Detalles: DevolucionVentaDetalle[];
}
