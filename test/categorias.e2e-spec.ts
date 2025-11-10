import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('CategoriasController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    // Login para obtener token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        nombreUsuario: 'admin',
        password: 'admin123',
      });

    accessToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/categorias (GET)', () => {
    it('should return 401 without token', () => {
      return request(app.getHttpServer())
        .get('/categorias')
        .expect(401);
    });

    it('should return list of categories with valid token', () => {
      return request(app.getHttpServer())
        .get('/categorias')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('/categorias (POST)', () => {
    it('should return 401 without token', () => {
      return request(app.getHttpServer())
        .post('/categorias')
        .send({
          nombre: 'Test Category',
          descripcion: 'Test Description',
        })
        .expect(401);
    });

    it('should create a new category with valid token', () => {
      return request(app.getHttpServer())
        .post('/categorias')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          nombre: 'Test Category E2E',
          descripcion: 'Test Description E2E',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('Id');
          expect(res.body).toHaveProperty('Nombre');
        });
    });
  });
});

