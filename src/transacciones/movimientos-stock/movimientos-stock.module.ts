import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovimientosStockService } from './movimientos-stock.service';
import { MovimientosStockController } from './movimientos-stock.controller';
import { MovimientoStock } from '../../database/postgresql/entities/movimiento-stock.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MovimientoStock])],
  controllers: [MovimientosStockController],
  providers: [MovimientosStockService],
  exports: [MovimientosStockService],
})
export class MovimientosStockModule {}

