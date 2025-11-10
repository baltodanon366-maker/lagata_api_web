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
import { Producto } from './producto.entity';
import { Categoria } from './categoria.entity';
import { Marca } from './marca.entity';
import { Modelo } from './modelo.entity';
import { CompraDetalle } from './compra-detalle.entity';
import { VentaDetalle } from './venta-detalle.entity';
import { MovimientoStock } from './movimiento-stock.entity';

@Entity('DetalleProducto')
export class DetalleProducto {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ name: 'ProductoId' })
  ProductoId: number;

  @Column({ name: 'CategoriaId' })
  CategoriaId: number;

  @Column({ name: 'MarcaId' })
  MarcaId: number;

  @Column({ name: 'ModeloId' })
  ModeloId: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  Codigo: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  SKU?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  Observaciones?: string;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  PrecioCompra: number;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  PrecioVenta: number;

  @Column({ type: 'integer', default: 0 })
  Stock: number;

  @Column({ type: 'integer', default: 0 })
  StockMinimo: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  UnidadMedida?: string;

  @Column({ type: 'timestamp', nullable: true })
  FechaUltimoMovimiento?: Date;

  @Column({ type: 'boolean', default: true })
  Activo: boolean;

  @CreateDateColumn({ name: 'FechaCreacion' })
  FechaCreacion: Date;

  @UpdateDateColumn({ name: 'FechaModificacion', nullable: true })
  FechaModificacion?: Date;

  // Relaciones
  @ManyToOne(() => Producto, (producto) => producto.DetallesProducto, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ProductoId' })
  Producto: Producto;

  @ManyToOne(() => Categoria, (categoria) => categoria.DetallesProducto)
  @JoinColumn({ name: 'CategoriaId' })
  Categoria: Categoria;

  @ManyToOne(() => Marca, (marca) => marca.DetallesProducto)
  @JoinColumn({ name: 'MarcaId' })
  Marca: Marca;

  @ManyToOne(() => Modelo, (modelo) => modelo.DetallesProducto)
  @JoinColumn({ name: 'ModeloId' })
  Modelo: Modelo;

  @OneToMany(() => CompraDetalle, (detalle) => detalle.DetalleProducto)
  ComprasDetalle?: CompraDetalle[];

  @OneToMany(() => VentaDetalle, (detalle) => detalle.DetalleProducto)
  VentasDetalle?: VentaDetalle[];

  @OneToMany(() => MovimientoStock, (movimiento) => movimiento.DetalleProducto)
  MovimientosStock?: MovimientoStock[];
}
