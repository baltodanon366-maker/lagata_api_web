import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CategoriasService } from './categorias.service';
import { Categoria } from '../../database/postgresql/entities/categoria.entity';

describe('CategoriasService', () => {
  let service: CategoriasService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let dataSource: DataSource;

  const mockDataSource = {
    query: jest.fn(),
  };

  const mockCategoriaRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriasService,
        {
          provide: getRepositoryToken(Categoria),
          useValue: mockCategoriaRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<CategoriasService>(CategoriasService);
    dataSource = module.get<DataSource>(DataSource);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const createDto = {
        nombre: 'Test Category',
        descripcion: 'Test Description',
      };

      const mockResult = [
        {
          p_categoria_id: 1,
        },
      ];

      const mockCategoria = {
        Id: 1,
        Nombre: 'Test Category',
        Descripcion: 'Test Description',
        Activo: true,
      };

      mockDataSource.query
        .mockResolvedValueOnce(mockResult) // Primera llamada para crear
        .mockResolvedValueOnce([mockCategoria]); // Segunda llamada para obtener

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await service.create(createDto);

      expect(mockDataSource.query).toHaveBeenCalledWith(
        'SELECT * FROM fn_Categoria_Crear($1, $2)',
        [createDto.nombre, createDto.descripcion || null],
      );
      expect(result).toEqual(mockCategoria);
    });
  });

  describe('findAll', () => {
    it('should return all active categories', async () => {
      const mockCategorias = [
        { Id: 1, Nombre: 'Category 1', Activo: true },
        { Id: 2, Nombre: 'Category 2', Activo: true },
      ];

      mockDataSource.query.mockResolvedValue(mockCategorias);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await service.findAll(100);

      expect(mockDataSource.query).toHaveBeenCalledWith(
        'SELECT * FROM fn_Categoria_MostrarActivos($1)',
        [100],
      );
      expect(result).toEqual(mockCategorias);
    });
  });
});
