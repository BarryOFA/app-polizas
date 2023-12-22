import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Patch,
  Delete,
} from '@nestjs/common'
import { VehiculosService } from './vehiculos.service'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'
import { VehiculosDto } from './dto/vehiculo.dto'
import { ConfigService } from '@nestjs/config'
import { CreateVehiculoDto } from './dto/create.dto'
// import { query } from 'express'

let NAME: string
let MESSAGE: string

@ApiSecurity('Api-Key')
@ApiTags('Vehiculos')
@Controller('api/v1/Vehiculos')
export class VehiculosController {
  constructor(
    private readonly VehiculoService: VehiculosService,
    private config: ConfigService,
  ) {
    NAME = `[${this.config.get<string>('app.applicationName')}]`
    MESSAGE = `${NAME} No se pudo conectar con la base de datos`
  }

  @Post()
  CreateVehiculoDto(@Body() body: CreateVehiculoDto) {
    return this.VehiculoService.create(body)
  }

  @Get()
  getAllClientes() {
    return this.VehiculoService.findAll()
  }

  @Get(':id')
  getClienteById(@Param('id') id: string) {
    return this.VehiculoService.findOne(id)
  }

  @Patch(':id')
  updateCliente(@Param('id') id: string, @Body() body: VehiculosDto) {
    return this.VehiculoService.update(id, body)
  }

  @Delete(':id')
  deleteCliente(@Param('id') id: string) {
    return this.VehiculoService.delete(id)
  }
}
