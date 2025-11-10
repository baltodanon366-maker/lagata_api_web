import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { HechoVenta } from './hecho-venta.entity';

@Entity('DimCliente')
export class DimCliente {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  ClienteCodigo: string;

  @Column({ type: 'varchar', length: 200 })
  ClienteNombre: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  RFC?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  TipoCliente?: string;

  @Column({ type: 'boolean', default: true })
  Activo: boolean;

  // Relaciones
  @OneToMany(() => HechoVenta, (hecho) => hecho.Cliente)
  HechosVenta?: HechoVenta[];
}
