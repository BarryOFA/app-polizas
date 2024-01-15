import {
  Get,
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common'
import { ClientelogicService } from './clientelogic.service'
import { CreateClienteDto } from './dto/create-clientelogic.dto'
import { UpdateClienteDto } from './dto/update-clientelogic.dto'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { PaginationDto } from 'src/commons/dto/pagination.dto'
import { Request } from 'express'

@ApiSecurity('Api-Key')
@ApiTags('Clientelogic')
@Controller('api/v1/Clientelogic')
export class ClientelogicController {
  constructor(
    private readonly clientelogicService: ClientelogicService,
    private config: ConfigService,
  ) {}

  @Post()
  async createRequest(@Req() req, @Body() createClienteDto: CreateClienteDto) {
    const trace = req.headers.trace as string
    return await this.clientelogicService.create(trace, createClienteDto)
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto, @Req() req: Request) {
    return this.clientelogicService.findAll(req.header('trace'), paginationDto)
  }

  @Get(':term')
  async findOne(@Req() req, @Param('term') term: string) {
    const trace = req.headers.trace as string
    return await this.clientelogicService.findOne(trace, term)
  }

  @Patch(':id')
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateClienteDto: UpdateClienteDto,
  ) {
    const trace = req.headers.trace as string
    return this.clientelogicService.update(trace, id, updateClienteDto)
  }
  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    const trace = req.headers.trace as string
    return this.clientelogicService.remove(trace, id)
  }

  @Get('poliza/:id')
  validatePoliza(@Req() req, @Param('id') id: string) {
    const trace = req.headers.trace as string
    return this.clientelogicService.validatePoliza(trace, id)
  }
}
