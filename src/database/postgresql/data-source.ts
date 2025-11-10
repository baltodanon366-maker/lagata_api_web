import { DataSource } from 'typeorm';
import { getPostgresConfig } from '../../common/config/database.config';
import { ConfigService } from '@nestjs/config';

/**
 * DataSource para PostgreSQL Operacional
 * Se usa para migraciones y conexiones directas
 */
export const createOperationalDataSource = (configService: ConfigService) => {
  const config = getPostgresConfig(configService);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return new DataSource({
    ...config,
    migrations: [__dirname + '/../../migrations/*{.ts,.js}'],
    migrationsTableName: 'migrations',
  } as any); // Type assertion para evitar conflictos de tipos
};
