import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { HechoVenta } from './hecho-venta.entity';

@Entity('DimEmpleado')
export class DimEmpleado {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  EmpleadoCodigo: string;

  @Column({ type: 'varchar', length: 200 })
  EmpleadoNombre: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  Departamento?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  Puesto?: string;

  @Column({ type: 'boolean', default: true })
  Activo: boolean;

  // Relaciones
  @OneToMany(() => HechoVenta, (hecho) => hecho.Empleado)
  HechosVenta?: HechoVenta[];
}
