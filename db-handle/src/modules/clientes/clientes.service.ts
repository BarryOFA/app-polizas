import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
// import { HttpService } from '@nestjs/axios'
// import applicationConfig from '../../config/config'
// import { ConfigType } from '@nestjs/config'
import { CreateClienteDto } from './dto/create.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Cliente } from './entities/cliente.entity'
import { UpdateClienteDto } from './dto/update.dto'

@Injectable()
export class ClientesService {
  constructor(
    @InjectModel('Cliente') private readonly clienteModel: Model<Cliente>,
  ) {}

  async create(cliente: CreateClienteDto): Promise<any> {
    const createdCliente = new this.clienteModel(cliente)
    return await createdCliente.save()
  }

  findAll() {
    try {
      const Clientes = this.clienteModel.find()
      return Clientes
    } catch (error) {
      throw new BadRequestException('error al listar todas los clientes')
    }
  }
  async findOne(id: string): Promise<any> {
    return await this.clienteModel.findById(id).exec()
  }

  async update(id: string, cliente: UpdateClienteDto): Promise<Cliente> {
    const existingCliente = await this.clienteModel.findByIdAndUpdate(
      id,
      cliente,
      { new: true },
    )

    if (!existingCliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`)
    }

    return existingCliente
  }

  async delete(id: string): Promise<any> {
    return await this.clienteModel.findByIdAndDelete(id).exec()
  }
}
