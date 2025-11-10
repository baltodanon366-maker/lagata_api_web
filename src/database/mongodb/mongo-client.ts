import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoClient, Db } from 'mongodb';

@Injectable()
export class MongoClientService implements OnModuleInit, OnModuleDestroy {
  private client: MongoClient | null = null;
  private db: Db | null = null;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const uri = this.configService.get<string>('MONGODB_URI');
    const database = this.configService.get<string>('MONGODB_DATABASE');

    // MongoDB es opcional - no fallar si no está configurado
    if (!uri || !database) {
      console.warn('⚠️  MongoDB configuration is missing - MongoDB features will be disabled');
      console.warn('   To enable MongoDB, set MONGODB_URI and MONGODB_DATABASE in .env');
      return;
    }

    try {
      this.client = new MongoClient(uri, {
        maxPoolSize: 10,
        minPoolSize: 2,
      });

      await this.client.connect();
      this.db = this.client.db(database);
      console.log('✅ Connected to MongoDB');
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error.message);
      console.warn('   MongoDB features will be disabled');
      // No lanzar error - permitir que la app funcione sin MongoDB
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.close();
      console.log('🔌 Disconnected from MongoDB');
    }
  }

  getDb(): Db | null {
    if (!this.db) {
      console.warn('⚠️  MongoDB is not configured or not connected');
      return null;
    }
    return this.db;
  }

  getClient(): MongoClient | null {
    if (!this.client) {
      console.warn('⚠️  MongoDB client is not configured or not connected');
      return null;
    }
    return this.client;
  }

  isConnected(): boolean {
    return this.db !== undefined && this.db !== null;
  }
}


