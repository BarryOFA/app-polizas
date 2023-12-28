import { Module } from '@nestjs/common'
import { ClientelogicService } from './clientelogic.service'
import { ClientelogicController } from './clientelogic.controller'

@Module({
  imports: [],
  controllers: [ClientelogicController],
  providers: [ClientelogicService],
})
export class ClientelogicModule {}
