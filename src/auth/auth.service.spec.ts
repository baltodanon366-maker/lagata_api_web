import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { AuthService } from './auth.service';
import { Usuario } from '../database/postgresql/entities/usuario.entity';
import { Rol } from '../database/postgresql/entities/rol.entity';
import { Permiso } from '../database/postgresql/entities/permiso.entity';
import { UsuarioRol } from '../database/postgresql/entities/usuario-rol.entity';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let usuarioRepository: any;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let jwtService: JwtService;

  const mockUsuarioRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockDataSource = {
    query: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: mockUsuarioRepository,
        },
        {
          provide: getRepositoryToken(Rol),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Permiso),
          useValue: {},
        },
        {
          provide: getRepositoryToken(UsuarioRol),
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'jwt.secret') return 'test-secret';
              if (key === 'jwt.expiration') return '1h';
              return null;
            }),
          },
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    usuarioRepository = module.get(getRepositoryToken(Usuario));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return JWT token and user data on successful login', async () => {
      const mockUsuario = {
        Id: 1,
        NombreUsuario: 'admin',
        Email: 'admin@test.com',
        PasswordHash: await bcrypt.hash('password123', 10),
        Rol: 'Administrador',
      };

      mockUsuarioRepository.findOne.mockResolvedValue(mockUsuario);
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await service.login({
        nombreUsuario: 'admin',
        password: 'password123',
      });

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('user');
      expect(result.access_token).toBe('mock-jwt-token');
      expect(result.user.nombreUsuario).toBe('admin');
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      mockUsuarioRepository.findOne.mockResolvedValue(null);

      await expect(
        service.login({
          nombreUsuario: 'admin',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow();
    });
  });
});
