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
import { Proveedor } from './proveedor.entity';
import { Usuario } from './usuario.entity';
import { CompraDetalle } from './compra-detalle.entity';

@Entity('Compras')
export class Compra {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  Folio: string;

  @Column({ name: 'ProveedorId' })
  ProveedorId: number;

  @Column({ name: 'UsuarioId' })
  UsuarioId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  FechaCompra: Date;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  Subtotal: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, default: 0 })
  Impuestos: number;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  Total: number;

  @Column({ type: 'varchar', length: 50, default: 'Pendiente' })
  Estado: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  Observaciones?: string;

  @CreateDateColumn({ name: 'FechaCreacion' })
  FechaCreacion: Date;

  @UpdateDateColumn({ name: 'FechaModificacion', nullable: true })
  FechaModificacion?: Date;

  // Relaciones
  @ManyToOne(() => Proveedor, (proveedor) => proveedor.Compras)
  @JoinColumn({ name: 'ProveedorId' })
  Proveedor: Proveedor;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'UsuarioId' })
  Usuario: Usuario;

  @OneToMany(() => CompraDetalle, (detalle) => detalle.Compra, {
    cascade: true,
  })
  Detalles: CompraDetalle[];
}
