import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Patch,
  Delete,
} from '@nestjs/common'
import { ClientesService } from './clientes.service'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'
import { CreateClienteDto } from './dto/create.dto'
import { UpdateClienteDto } from './dto/update.dto'
import { ParseMongoIdPipe } from '../../commons/pipes/parse-mongo-id.pipes'

@ApiSecurity('Api-Key')
@ApiTags('Clientes')
@Controller('api/v1/Clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  createCliente(@Body() createClienteDto: CreateClienteDto) {
    return this.clientesService.create(createClienteDto)
  }

  @Get()
  findAll() {
    return this.clientesService.findAll()
  }

  @Get(':id')
  getClienteById(@Param('id') id: string) {
    return this.clientesService.findOne(id)
  }

  @Patch(':id')
  updateCliente(
    @Param('id') id: string,
    @Body() updateCliente: UpdateClienteDto,
  ) {
    return this.clientesService.update(id, updateCliente)
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.clientesService.remove(id)
  }
}
