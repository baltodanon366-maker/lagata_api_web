import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Usuario } from '../database/postgresql/entities/usuario.entity';
import { Rol } from '../database/postgresql/entities/rol.entity';
import { Permiso } from '../database/postgresql/entities/permiso.entity';
import { UsuarioRol } from '../database/postgresql/entities/usuario-rol.entity';
import { getJwtConfig } from '../common/config/jwt.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, Rol, Permiso, UsuarioRol]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getJwtConfig,
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
