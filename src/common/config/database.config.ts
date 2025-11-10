import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

/**
 * Configuración para PostgreSQL Operacional
 * Soporta tanto Azure como Supabase
 */
export const getPostgresConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  // Prioridad: Connection string > Variables individuales
  const connectionUrl =
    configService.get<string>('POSTGRES_URL') ||
    configService.get<string>('DIRECT_URL') ||
    configService.get<string>('SUPABASE_DB_URL') ||
    configService.get<string>('AZURE_DB_URL');

  // Si hay connection string, usarlo directamente
  if (connectionUrl) {
    return {
      type: 'postgres',
      url: connectionUrl,
      entities: [
        __dirname + '/../../database/postgresql/entities/**/*.entity{.ts,.js}',
      ],
      synchronize: configService.get<string>('NODE_ENV') === 'development',
      ssl: connectionUrl.includes('sslmode=require') || {
        rejectUnauthorized: false, // Azure y Supabase requieren SSL
      },
      extra: {
        max: 20, // Máximo de conexiones en pool
        connectionTimeoutMillis: 2000,
      },
    };
  }

  // Si no hay connection string, usar variables individuales
  const host =
    configService.get<string>('SUPABASE_DB_HOST') ||
    configService.get<string>('AZURE_DB_HOST') ||
    configService.get<string>('POSTGRES_HOST') ||
    'localhost';

  const port =
    configService.get<number>('SUPABASE_DB_PORT') ||
    configService.get<number>('AZURE_DB_PORT') ||
    configService.get<number>('POSTGRES_PORT') ||
    5432;

  const database =
    configService.get<string>('SUPABASE_DB_NAME') ||
    configService.get<string>('AZURE_DB_NAME') ||
    configService.get<string>('POSTGRES_DATABASE') ||
    'licoreria_db';

  const username =
    configService.get<string>('SUPABASE_DB_USER') ||
    configService.get<string>('AZURE_DB_USER') ||
    configService.get<string>('POSTGRES_USER') ||
    'postgres';

  const password =
    configService.get<string>('SUPABASE_DB_PASSWORD') ||
    configService.get<string>('AZURE_DB_PASSWORD') ||
    configService.get<string>('POSTGRES_PASSWORD');

  const sslEnabled =
    configService.get<string>('SUPABASE_DB_SSL') === 'true' ||
    configService.get<string>('AZURE_DB_SSL') === 'true' ||
    configService.get<string>('POSTGRES_SSL') === 'true' ||
    true; // Por defecto SSL activado para Azure/Supabase

  return {
    type: 'postgres',
    host,
    port,
    database,
    username,
    password,
    entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
    synchronize: configService.get<string>('NODE_ENV') === 'development',
    ssl: sslEnabled
      ? {
          rejectUnauthorized: false,
        }
      : false,
    extra: {
      max: 20,
      connectionTimeoutMillis: 2000,
    },
  };
};

/**
 * Configuración para PostgreSQL DataWarehouse
 * Soporta tanto Azure como Supabase
 */
export const getDataWarehouseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  // Prioridad: Connection string > Variables individuales
  const connectionUrl =
    configService.get<string>('SUPABASE_DW_URL') ||
    configService.get<string>('AZURE_DW_URL') ||
    configService.get<string>('DW_URL') ||
    configService.get<string>('DIRECT_DW_URL');

  // Si hay connection string, usarlo directamente
  if (connectionUrl) {
    return {
      type: 'postgres',
      url: connectionUrl,
      entities: [
        __dirname + '/../../database/datawarehouse/entities/**/*.entity{.ts,.js}',
      ],
      synchronize: false, // Nunca sincronizar DataWarehouse
      ssl: connectionUrl.includes('sslmode=require') || {
        rejectUnauthorized: false,
      },
      extra: {
        max: 20,
        connectionTimeoutMillis: 2000,
      },
    };
  }

  // Si no hay connection string, usar variables individuales
  const host =
    configService.get<string>('SUPABASE_DW_HOST') ||
    configService.get<string>('AZURE_DW_HOST') ||
    configService.get<string>('DW_HOST') ||
    'localhost';

  const port =
    configService.get<number>('SUPABASE_DW_PORT') ||
    configService.get<number>('AZURE_DW_PORT') ||
    configService.get<number>('DW_PORT') ||
    5432;

  const database =
    configService.get<string>('SUPABASE_DW_NAME') ||
    configService.get<string>('AZURE_DW_NAME') ||
    configService.get<string>('DW_DATABASE') ||
    'licoreria_dw';

  const username =
    configService.get<string>('SUPABASE_DW_USER') ||
    configService.get<string>('AZURE_DW_USER') ||
    configService.get<string>('DW_USER') ||
    'postgres';

  const password =
    configService.get<string>('SUPABASE_DW_PASSWORD') ||
    configService.get<string>('AZURE_DW_PASSWORD') ||
    configService.get<string>('DW_PASSWORD');

  const sslEnabled =
    configService.get<string>('SUPABASE_DW_SSL') === 'true' ||
    configService.get<string>('AZURE_DW_SSL') === 'true' ||
    configService.get<string>('DW_SSL') === 'true' ||
    true;

  return {
    type: 'postgres',
    host,
    port,
    database,
    username,
    password,
    entities: [__dirname + '/../../**/*.dw.entity{.ts,.js}'],
    synchronize: false, // Nunca sincronizar DataWarehouse
    ssl: sslEnabled
      ? {
          rejectUnauthorized: false,
        }
      : false,
    extra: {
      max: 20,
      connectionTimeoutMillis: 2000,
    },
  };
};

