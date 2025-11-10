import { DataSource } from 'typeorm';
import { getDataWarehouseConfig } from '../../common/config/database.config';
import { ConfigService } from '@nestjs/config';

/**
 * DataSource para PostgreSQL DataWarehouse
 * Se usa para migraciones y conexiones directas
 */
export const createDataWarehouseDataSource = (configService: ConfigService) => {
  const config = getDataWarehouseConfig(configService);
  return new DataSource({
    ...config,
    migrations: [__dirname + '/../../migrations/dw/*{.ts,.js}'],
    migrationsTableName: 'dw_migrations',
  } as any); // Type assertion para evitar conflictos de tipos
};

