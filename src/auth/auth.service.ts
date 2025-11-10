import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../database/postgresql/entities/usuario.entity';
import { Rol } from '../database/postgresql/entities/rol.entity';
import { Permiso } from '../database/postgresql/entities/permiso.entity';
import { UsuarioRol } from '../database/postgresql/entities/usuario-rol.entity';
import { LoginDto, RegisterDto, ChangePasswordDto, AsignarRolDto } from './dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(Rol)
    private rolRepository: Repository<Rol>,
    @InjectRepository(Permiso)
    private permisoRepository: Repository<Permiso>,
    @InjectRepository(UsuarioRol)
    private usuarioRolRepository: Repository<UsuarioRol>,
    private jwtService: JwtService,
    private dataSource: DataSource,
  ) {}

  async validateUser(nombreUsuario: string, password: string): Promise<any> {
    // Buscar usuario por nombre de usuario o email
    const usuario = await this.usuarioRepository.findOne({
      where: [
        { NombreUsuario: nombreUsuario, Activo: true },
        { Email: nombreUsuario, Activo: true },
      ],
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(
      password,
      usuario.PasswordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Actualizar último acceso
    usuario.UltimoAcceso = new Date();
    await this.usuarioRepository.save(usuario);

    return {
      id: usuario.Id,
      nombreUsuario: usuario.NombreUsuario,
      email: usuario.Email,
      rol: usuario.Rol,
    };
  }

  async login(loginDto: LoginDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const user = await this.validateUser(
      loginDto.nombreUsuario,
      loginDto.password,
    );

    const payload: JwtPayload = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      sub: user.id,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      nombreUsuario: user.nombreUsuario,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      email: user.email,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      rol: user.rol,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        id: user.id,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        nombreUsuario: user.nombreUsuario,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        email: user.email,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        rol: user.rol,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    // Verificar si el usuario ya existe
    const usuarioExistente = await this.usuarioRepository.findOne({
      where: [
        { NombreUsuario: registerDto.nombreUsuario },
        { Email: registerDto.email },
      ],
    });

    if (usuarioExistente) {
      throw new ConflictException(
        'El nombre de usuario o email ya está en uso',
      );
    }

    // Hash de la contraseña
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(registerDto.password, saltRounds);

    // Crear nuevo usuario
    const nuevoUsuario = this.usuarioRepository.create({
      NombreUsuario: registerDto.nombreUsuario,
      Email: registerDto.email,
      PasswordHash: passwordHash,
      NombreCompleto: registerDto.nombreCompleto || registerDto.nombreUsuario,
      Rol: registerDto.rol || 'Usuario',
      Activo: true,
    });

    const usuarioGuardado = await this.usuarioRepository.save(nuevoUsuario);

    // Generar token
    const payload: JwtPayload = {
      sub: usuarioGuardado.Id,
      nombreUsuario: usuarioGuardado.NombreUsuario,
      email: usuarioGuardado.Email,
      rol: usuarioGuardado.Rol,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: usuarioGuardado.Id,
        nombreUsuario: usuarioGuardado.NombreUsuario,
        email: usuarioGuardado.Email,
        rol: usuarioGuardado.Rol,
      },
    };
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const usuario = await this.usuarioRepository.findOne({
      where: { Id: userId },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Verificar contraseña actual
    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.passwordActual,
      usuario.PasswordHash,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('La contraseña actual es incorrecta');
    }

    // Validar que la nueva contraseña sea diferente
    const isSamePassword = await bcrypt.compare(
      changePasswordDto.nuevaPassword,
      usuario.PasswordHash,
    );

    if (isSamePassword) {
      throw new BadRequestException(
        'La nueva contraseña debe ser diferente a la actual',
      );
    }

    // Hash de la nueva contraseña
    const saltRounds = 12;
    usuario.PasswordHash = await bcrypt.hash(
      changePasswordDto.nuevaPassword,
      saltRounds,
    );

    await this.usuarioRepository.save(usuario);

    return {
      message: 'Contraseña actualizada exitosamente',
    };
  }

  async getProfile(userId: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: { Id: userId },
      select: [
        'Id',
        'NombreUsuario',
        'Email',
        'NombreCompleto',
        'Rol',
        'Activo',
        'FechaCreacion',
        'UltimoAcceso',
      ],
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return usuario;
  }

  async getPermisos(userId: number) {
    // Usar la función PostgreSQL fn_Usuario_ObtenerPermisos
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const permisos = await this.dataSource.query(
      'SELECT * FROM fn_Usuario_ObtenerPermisos($1)',
      [userId],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return permisos;
  }

  async getRoles() {
    const roles = await this.rolRepository.find({
      where: { Activo: true },
      order: { Nombre: 'ASC' },
    });

    return roles;
  }

  async asignarRol(currentUserId: number, asignarRolDto: AsignarRolDto) {
    // Verificar que el usuario actual sea administrador
    const currentUser = await this.usuarioRepository.findOne({
      where: { Id: currentUserId },
    });

    if (!currentUser || currentUser.Rol !== 'Administrador') {
      throw new ForbiddenException(
        'Solo los administradores pueden asignar roles',
      );
    }

    // Verificar que el usuario y rol existen
    const usuario = await this.usuarioRepository.findOne({
      where: { Id: asignarRolDto.usuarioId },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const rol = await this.rolRepository.findOne({
      where: { Id: asignarRolDto.rolId },
    });

    if (!rol) {
      throw new NotFoundException('Rol no encontrado');
    }

    // Usar la función PostgreSQL fn_Usuario_AsignarRol
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.dataSource.query(
      'SELECT * FROM fn_Usuario_AsignarRol($1, $2)',
      [asignarRolDto.usuarioId, asignarRolDto.rolId],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const exito = result[0]?.p_resultado || false;

    if (!exito) {
      throw new BadRequestException('No se pudo asignar el rol');
    }

    // Obtener el usuario actualizado
    const usuarioActualizado = await this.usuarioRepository.findOne({
      where: { Id: asignarRolDto.usuarioId },
      relations: ['UsuariosRoles', 'UsuariosRoles.Rol'],
    });

    if (!usuarioActualizado) {
      throw new NotFoundException(
        'Usuario no encontrado después de asignar rol',
      );
    }

    return {
      message: 'Rol asignado exitosamente',
      usuario: {
        id: usuarioActualizado.Id,
        nombreUsuario: usuarioActualizado.NombreUsuario,
        email: usuarioActualizado.Email,
        rol: usuarioActualizado.Rol,
      },
    };
  }
}
