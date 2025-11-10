import { Injectable, CanActivate, ExecutionContext, ServiceUnavailableException, Optional } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class MongoDbGuard implements CanActivate {
  constructor(
    @Optional()
    @InjectConnection()
    private connection?: Connection,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // Verificar si MongoDB está conectado
    if (!this.connection || this.connection.readyState !== 1) {
      throw new ServiceUnavailableException(
        'MongoDB no está disponible. Por favor, configura MONGODB_URI y MONGODB_DATABASE en el archivo .env y crea el proyecto en MongoDB Atlas.',
      );
    }

    return true;
  }
}

