import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { HechoVenta } from './hecho-venta.entity';
import { HechoCompra } from './hecho-compra.entity';
import { HechoInventario } from './hecho-inventario.entity';

@Entity('DimTiempo')
export class DimTiempo {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'date', unique: true })
  Fecha: Date;

  @Column({ type: 'integer' })
  Anio: number;

  @Column({ type: 'integer' })
  Trimestre: number;

  @Column({ type: 'integer' })
  Mes: number;

  @Column({ type: 'integer' })
  Semana: number;

  @Column({ type: 'integer' })
  Dia: number;

  @Column({ type: 'integer' })
  DiaSemana: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  NombreMes?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  NombreDiaSemana?: string;

  @Column({ type: 'boolean' })
  EsFinDeSemana: boolean;

  @Column({ type: 'boolean', default: false })
  EsFestivo: boolean;

  // Relaciones
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @OneToMany(() => HechoVenta, (hecho) => hecho.Fecha)
  HechosVenta?: HechoVenta[];

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @OneToMany(() => HechoCompra, (hecho) => hecho.Fecha)
  HechosCompra?: HechoCompra[];

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @OneToMany(() => HechoInventario, (hecho) => hecho.Fecha)
  HechosInventario?: HechoInventario[];
}
