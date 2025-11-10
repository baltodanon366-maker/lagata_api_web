import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { HechoCompra } from './hecho-compra.entity';

@Entity('DimProveedor')
export class DimProveedor {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  ProveedorCodigo: string;

  @Column({ type: 'varchar', length: 200 })
  ProveedorNombre: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  RFC?: string;

  @Column({ type: 'boolean', default: true })
  Activo: boolean;

  // Relaciones
  @OneToMany(() => HechoCompra, (hecho) => hecho.Proveedor)
  HechosCompra?: HechoCompra[];
}
