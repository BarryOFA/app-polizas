import { Module } from '@nestjs/common'
import { ClientesController } from './clientes.controller'
import { ClientesService } from './clientes.service'
import { ClienteSchema } from './entities/cliente.entity'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: 'Cliente', schema: ClienteSchema }]),
  ],
  controllers: [ClientesController],
  providers: [ClientesService],
})
export class ClientesModule {}
