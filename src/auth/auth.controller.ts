import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, ChangePasswordDto, AsignarRolDto } from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            nombreUsuario: { type: 'string' },
            email: { type: 'string' },
            rol: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            nombreUsuario: { type: 'string' },
            email: { type: 'string' },
            rol: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 409, description: 'Usuario o email ya existe' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cambiar contraseña' })
  @ApiResponse({
    status: 200,
    description: 'Contraseña actualizada exitosamente',
  })
  @ApiResponse({ status: 400, description: 'Contraseña actual incorrecta' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.authService.changePassword(req.user.id, changePasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Perfil del usuario',
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async getProfile(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.authService.getProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('permisos')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtener permisos del usuario autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Lista de permisos del usuario',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          Id: { type: 'number' },
          Nombre: { type: 'string' },
          Descripcion: { type: 'string' },
          Modulo: { type: 'string' },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async getPermisos(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.authService.getPermisos(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('roles')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtener lista de roles disponibles' })
  @ApiResponse({
    status: 200,
    description: 'Lista de roles activos',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          Id: { type: 'number' },
          Nombre: { type: 'string' },
          Descripcion: { type: 'string' },
          Activo: { type: 'boolean' },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async getRoles() {
    return this.authService.getRoles();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador')
  @Post('asignar-rol')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Asignar rol a un usuario (Solo Administrador)' })
  @ApiResponse({
    status: 200,
    description: 'Rol asignado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        usuario: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            nombreUsuario: { type: 'string' },
            email: { type: 'string' },
            rol: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({
    status: 403,
    description: 'No tienes permisos (Solo Administrador)',
  })
  @ApiResponse({ status: 404, description: 'Usuario o rol no encontrado' })
  async asignarRol(@Request() req, @Body() asignarRolDto: AsignarRolDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.authService.asignarRol(req.user.id, asignarRolDto);
  }
}
