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
import { Usuario } from './usuario.entity';
import { Venta } from './venta.entity';

@Entity('Empleados')
export class Empleado {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ name: 'UsuarioId', nullable: true })
  UsuarioId?: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  CodigoEmpleado: string;

  @Column({ type: 'varchar', length: 200 })
  NombreCompleto: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  Telefono?: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  Email?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  Direccion?: string;

  @Column({ type: 'date', nullable: true })
  FechaNacimiento?: Date;

  @Column({ type: 'date' })
  FechaIngreso: Date;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
  Salario?: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  Departamento?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  Puesto?: string;

  @Column({ type: 'boolean', default: true })
  Activo: boolean;

  @CreateDateColumn({ name: 'FechaCreacion' })
  FechaCreacion: Date;

  @UpdateDateColumn({ name: 'FechaModificacion', nullable: true })
  FechaModificacion?: Date;

  // Relaciones
  @ManyToOne(() => Usuario, (usuario) => usuario.Empleados)
  @JoinColumn({ name: 'UsuarioId' })
  Usuario?: Usuario;

  @OneToMany(() => Venta, (venta) => venta.Empleado)
  Ventas?: Venta[];
}
