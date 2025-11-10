import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({})
export class MongooseOptionalModule {
  static forRootAsync(): DynamicModule {
    return {
      module: MongooseOptionalModule,
      imports: [
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => {
            const uri = configService.get<string>('MONGODB_URI');
            const database = configService.get<string>('MONGODB_DATABASE');
            
            if (!uri || !database) {
              console.warn('⚠️  MongoDB configuration is missing - MongoDB endpoints will return 503');
              // Retornar configuración que no bloqueará el inicio
              // Mongoose intentará conectar pero fallará rápidamente sin bloquear
              return {
                uri: 'mongodb://127.0.0.1:27017/dummy',
                dbName: 'dummy',
                serverSelectionTimeoutMS: 50, // Timeout muy corto (50ms)
                socketTimeoutMS: 50,
                connectTimeoutMS: 50,
                retryWrites: false,
                bufferMaxEntries: 0,
                bufferCommands: false,
                maxPoolSize: 0, // No crear pool
                minPoolSize: 0,
                autoIndex: false,
                autoCreate: false,
                // No reintentar conexión
                retryReads: false,
                // No hacer retry automático
                retryConnection: false,
              };
            }

            return {
              uri: uri,
              dbName: database,
              retryWrites: true,
              w: 'majority',
              serverSelectionTimeoutMS: 5000,
            };
          },
          inject: [ConfigService],
        }),
      ],
    };
  }
}

