import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { VehiculosController } from './vehiculos.controller'
import { VehiculosService } from './vehiculos.service'
import { VehiculoSchema } from './entities/vehiculo.entity' // Importa tu modelo y esquema aquí
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: 'Vehiculo', schema: VehiculoSchema }]),
  ],
  controllers: [VehiculosController],
  providers: [VehiculosService],
})
export class VehiculosModule {}
