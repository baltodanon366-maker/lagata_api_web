import { ConfigService } from '@nestjs/config';
import { MongoClient, MongoClientOptions } from 'mongodb';

export const getMongoConfig = (configService: ConfigService) => {
  const uri = configService.get<string>('MONGODB_URI');
  const database = configService.get<string>('MONGODB_DATABASE');

  if (!uri || !database) {
    throw new Error('MongoDB configuration is missing');
  }

  const options: MongoClientOptions = {
    maxPoolSize: 10,
    minPoolSize: 2,
  };

  return {
    uri,
    database,
    options,
  };
};

export const createMongoClient = async (
  configService: ConfigService,
): Promise<MongoClient> => {
  const { uri, options } = getMongoConfig(configService);
  const client = new MongoClient(uri, options);
  await client.connect();
  return client;
};


