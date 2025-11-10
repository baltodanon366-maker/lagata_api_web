import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from './usuario.entity';
import { Rol } from './rol.entity';

@Entity('UsuariosRoles')
export class UsuarioRol {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ name: 'UsuarioId' })
  UsuarioId: number;

  @Column({ name: 'RolId' })
  RolId: number;

  @CreateDateColumn({ name: 'FechaAsignacion' })
  FechaAsignacion: Date;

  // Relaciones
  @ManyToOne(() => Usuario, (usuario) => usuario.UsuariosRoles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'UsuarioId' })
  Usuario: Usuario;

  @ManyToOne(() => Rol, (rol) => rol.UsuariosRoles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'RolId' })
  Rol: Rol;
}
