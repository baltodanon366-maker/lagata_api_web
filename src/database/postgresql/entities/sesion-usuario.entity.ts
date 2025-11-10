import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('SesionesUsuario')
export class SesionUsuario {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ name: 'UsuarioId' })
  UsuarioId: number;

  @Column({ type: 'text', nullable: true })
  Token?: string;

  @CreateDateColumn({ name: 'FechaInicio' })
  FechaInicio: Date;

  @Column({ type: 'timestamp', nullable: true })
  FechaExpiracion?: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  IpAddress?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  UserAgent?: string;

  @Column({ type: 'boolean', default: true })
  Activa: boolean;

  // Relaciones
  @ManyToOne(() => Usuario, (usuario) => usuario.Sesiones, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'UsuarioId' })
  Usuario: Usuario;
}
