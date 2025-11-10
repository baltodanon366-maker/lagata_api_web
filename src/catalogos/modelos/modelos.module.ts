import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelosService } from './modelos.service';
import { ModelosController } from './modelos.controller';
import { Modelo } from '../../database/postgresql/entities/modelo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Modelo])],
  controllers: [ModelosController],
  providers: [ModelosService],
  exports: [ModelosService],
})
export class ModelosModule {}
