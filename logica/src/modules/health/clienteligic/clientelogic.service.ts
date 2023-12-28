import {
  BadRequestException,
  Injectable,
  Inject,
  ServiceUnavailableException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import applicationConfig from 'src/config/config'
import * as dotenv from 'dotenv'
import { firstValueFrom, retry, timeout } from 'rxjs'
import { CreateClienteDto } from './dto/create-clientelogic.dto'
import { UpdateClienteDto } from './dto/update-clientelogic.dto'
import { ConfigType } from '@nestjs/config'
import { PaginationDto } from 'src/commons/dto/pagination.dto'

dotenv.config()

@Injectable()
export class ManangerUserTicketService {
  constructor(
    @Inject(applicationConfig.KEY)
    private readonly appConfig: ConfigType<typeof applicationConfig>,
    private readonly httpService: HttpService,
  ) {}

  async create(trace: string, createClienteDto: CreateClienteDto) {
    const httpOptions = {
      headers: {
        apiKey: this.appConfig.apiKey,
        trace: trace,
      },
    }

    try {
      const response = await firstValueFrom(
        this.httpService
          .post(`${this.appConfig.dbBaseUrl}`, createClienteDto, httpOptions)
          .pipe(
            timeout(Number(this.appConfig.httpTimeout)),
            retry(Number(this.appConfig.retries)),
          ),
      )
      return response.data
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async findAll(trace: string, paginationDto: PaginationDto) {
    const httpOptions = {
      headers: {
        apiKey: this.appConfig.apiKey,
        trace: trace,
      },
      params: paginationDto,
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
  async findOne(trace: string, term: string) {
    const httpOptions = {
      headers: {
        apiKey: this.appConfig.apiKey,
        trace: trace,
      },
    }
    try {
      const response = await firstValueFrom(
        this.httpService
          .get(`${this.appConfig.dbBaseUrl}/${term}`, httpOptions)
          .pipe(
            timeout(Number(this.appConfig.httpTimeout)),
            retry(Number(this.appConfig.retries)),
          ),
      )
      return response.data
    } catch (error) {
      console.log(error)
      throw new BadRequestException(
        `Error listando los clientes : ${JSON.stringify(
          error.response?.data || error.message,
        )}`,
      )
    }
  }

  async update(trace: string, id: string, updateClienteDto: UpdateClienteDto) {
    const httpOptions = {
      headers: {
        apiKey: this.appConfig.apiKey,
        trace: trace,
      },
    }
    try {
      const response = await firstValueFrom(
        this.httpService
          .patch(
            `${this.appConfig.dbBaseUrl}/${id}`,
            updateClienteDto,
            httpOptions,
          )
          .pipe(
            timeout(Number(this.appConfig.httpTimeout)),
            retry(Number(this.appConfig.retries)),
          ),
      )
      return response.data
    } catch (error) {
      console.log(error)
      throw new BadRequestException(
        `Error actualizando la persona : ${JSON.stringify(
          error.response?.data || error.message,
        )}`,
      )
    }
  }
  async remove(trace: string, id: string) {
    const httpOptions = {
      headers: {
        apiKey: this.appConfig.apiKey,
        trace: trace,
      },
    }
    try {
      const response = await firstValueFrom(
        this.httpService
          .delete(`${this.appConfig.dbBaseUrl}/${id}`, httpOptions)
          .pipe(
            timeout(Number(this.appConfig.httpTimeout)),
            retry(Number(this.appConfig.retries)),
          ),
      )
      return response.data
    } catch (error) {
      console.log(error)
      throw new BadRequestException(
        `Error eliminando la persona : ${JSON.stringify(
          error.response?.data || error.message,
        )}`,
      )
    }
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      const keyValue = error.keyValue
      const fieldName = Object.keys(keyValue)[0]
      const fieldValue = keyValue[fieldName]
      throw new BadRequestException(
        `El nombre del Cliente '${fieldValue}' ya existe en la base de datos.`,
      )
    }
    throw new InternalServerErrorException(
      `No se puede crar cliente - Ver server logs`,
    )
  }
}
