import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Put,
  Patch,
  Delete,
} from '@nestjs/common'
import { ClientesService } from './clientes.service'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'
import { ClientesDto } from 'src/modules/clientes/dto/cliente.dto'
import { ConfigService } from '@nestjs/config'
import { CreateClienteDto } from './dto/create.dto'
// import { query } from 'express'

let NAME: string
let MESSAGE: string

@ApiSecurity('Api-Key')
@ApiTags('Clientes')
@Controller('api/v1/Clientes')
export class ClientesController {
  constructor(
    private readonly clientesService: ClientesService,
    private config: ConfigService,
  ) {
    NAME = `[${this.config.get<string>('app.applicationName')}]`
    MESSAGE = `${NAME} No se pudo conectar con la base de datos`
  }

  @Post()
  createCliente(@Body() body: CreateClienteDto) {
    return this.clientesService.create(body)
  }

  @Get()
  getAllClientes() {
    return this.clientesService.findAll()
  }

  @Get(':id')
  getClienteById(@Param('id') id: string) {
    return this.clientesService.findOne(id)
  }

  @Patch(':id')
  updateCliente(@Param('id') id: string, @Body() body: ClientesDto) {
    return this.clientesService.update(id, body)
  }

  @Delete(':id')
  deleteCliente(@Param('id') id: string) {
    return this.clientesService.delete(id)
  }
}
