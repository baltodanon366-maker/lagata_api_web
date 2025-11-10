import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  getPostgresConfig,
  getDataWarehouseConfig,
} from '../common/config/database.config';
import { MongoClientService } from './mongodb/mongo-client';
// MongoDB deshabilitado temporalmente - descomentar cuando se configure MongoDB Atlas
// import { MongooseOptionalModule } from './mongodb/mongoose-optional.module';

@Module({
  imports: [
    // PostgreSQL Operacional
    TypeOrmModule.forRootAsync({
      name: 'default', // Conexión por defecto
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        getPostgresConfig(configService),
      inject: [ConfigService],
    }),
    // PostgreSQL DataWarehouse
    TypeOrmModule.forRootAsync({
      name: 'datawarehouse', // Conexión nombrada para DataWarehouse
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        getDataWarehouseConfig(configService),
      inject: [ConfigService],
    }),
  ],
  providers: [MongoClientService],
  exports: [MongoClientService],
})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    // MongoDB deshabilitado temporalmente - descomentar cuando se configure MongoDB Atlas
    // const isMongoConfigured = process.env.MONGODB_URI && process.env.MONGODB_DATABASE;

    return {
      module: DatabaseModule,
      imports: [
        // MongoDB (Mongoose) - Deshabilitado temporalmente
        // Descomentar cuando se configure MongoDB Atlas:
        // ...(isMongoConfigured ? [MongooseOptionalModule.forRootAsync()] : []),
      ],
    };
  }
}
