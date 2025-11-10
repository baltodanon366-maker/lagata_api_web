import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleProductoService } from './detalle-producto.service';
import { DetalleProductoController } from './detalle-producto.controller';
import { DetalleProducto } from '../../database/postgresql/entities/detalle-producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DetalleProducto])],
  controllers: [DetalleProductoController],
  providers: [DetalleProductoService],
  exports: [DetalleProductoService],
})
export class DetalleProductoModule {}
