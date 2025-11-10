import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevolucionesService } from './devoluciones.service';
import { DevolucionesController } from './devoluciones.controller';
import { DevolucionVenta } from '../../database/postgresql/entities/devolucion-venta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DevolucionVenta])],
  controllers: [DevolucionesController],
  providers: [DevolucionesService],
  exports: [DevolucionesService],
})
export class DevolucionesModule {}

