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
import { DimCliente } from './dim-cliente.entity';
import { DimEmpleado } from './dim-empleado.entity';
import { DimCategoria } from './dim-categoria.entity';

@Entity('HechoVenta')
export class HechoVenta {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ name: 'FechaId' })
  FechaId: number;

  @Column({ name: 'ProductoId' })
  ProductoId: number;

  @Column({ name: 'ClienteId', nullable: true })
  ClienteId?: number;

  @Column({ name: 'EmpleadoId', nullable: true })
  EmpleadoId?: number;

  @Column({ name: 'CategoriaId', nullable: true })
  CategoriaId?: number;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  TotalVentas: number;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  CantidadVendida: number;

  @Column({ type: 'integer' })
  CantidadTransacciones: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
  PromedioTicket?: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, default: 0 })
  DescuentoTotal: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, default: 0 })
  ImpuestosTotal: number;

  @CreateDateColumn({ name: 'FechaProcesamiento' })
  FechaProcesamiento: Date;

  // Relaciones
  @ManyToOne(() => DimTiempo, (tiempo) => tiempo.HechosVenta)
  @JoinColumn({ name: 'FechaId' })
  Fecha: DimTiempo;

  @ManyToOne(() => DimProducto, (producto) => producto.HechosVenta)
  @JoinColumn({ name: 'ProductoId' })
  Producto: DimProducto;

  @ManyToOne(() => DimCliente, (cliente) => cliente.HechosVenta)
  @JoinColumn({ name: 'ClienteId' })
  Cliente?: DimCliente;

  @ManyToOne(() => DimEmpleado, (empleado) => empleado.HechosVenta)
  @JoinColumn({ name: 'EmpleadoId' })
  Empleado?: DimEmpleado;

  @ManyToOne(() => DimCategoria, (categoria) => categoria.HechosVenta)
  @JoinColumn({ name: 'CategoriaId' })
  Categoria?: DimCategoria;
}
