import { Inject, Injectable, NotFoundException } from '@nestjs/common'
// import { HttpService } from '@nestjs/axios'
// import applicationConfig from '../../config/config'
// import { ConfigType } from '@nestjs/config'
import { CreateClienteDto } from './dto/create.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Cliente } from './entities/cliente.entity'
import { UpdateClienteDto } from './dto/update.dto'
import { HttpService } from '@nestjs/axios'
import applicationConfig from '../../config/config'
import { firstValueFrom, timeout, retry } from 'rxjs'
import { ConfigType } from '@nestjs/config'
import { BadRequestException } from '@nestjs/common'
@Injectable()
export class ClientesService {
  constructor(
    @Inject(applicationConfig.KEY)
    private httpService: HttpService,
    private readonly appConfig: ConfigType<typeof applicationConfig>,
    @InjectModel('Cliente') private readonly clienteModel: Model<Cliente>,
  ) {}

  async create(cliente: CreateClienteDto): Promise<any> {
    const createdCliente = new this.clienteModel(cliente)
    return await createdCliente.save()
  }

  async findAll(trace: string) {
    const httpOptions = {
      headers: {
        apiKey: this.appConfig.apiKey,
        trace: trace,
      },
    }
    try {
      const response = await firstValueFrom(
        this.httpService
          .get(`${this.appConfig.dbBaseUrl}`, httpOptions)
          .pipe(
            timeout(Number(this.appConfig.httpTimeout)),
            retry(Number(this.appConfig.retries)),
          ),
      )
      return response.data
    } catch (error) {
      console.log(error)
      throw new BadRequestException(
        `Error listando las personas : ${JSON.stringify(
          error.response?.data || error.message,
        )}`,
      )
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
