import {
  BadRequestException,
  Injectable,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import applicationConfig from 'src/config/config'
import * as dotenv from 'dotenv'
import { firstValueFrom, retry } from 'rxjs'
import { CreateClienteDto } from './dto/create-clientelogic.dto'
import { UpdateClienteDto } from './dto/update-clientelogic.dto'
import { ConfigType } from '@nestjs/config'
import { PaginationDto } from 'src/commons/dto/pagination.dto'

dotenv.config()

@Injectable()
export class ClientelogicService {
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
            retry({
              count: +this.appConfig.retries,
              delay: +this.appConfig.retriesDelay,
              resetOnSuccess: true,
            }),
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
        this.httpService.get(`${this.appConfig.dbBaseUrl}`, httpOptions).pipe(
          retry({
            count: +this.appConfig.retries,
            delay: +this.appConfig.retriesDelay,
            resetOnSuccess: true,
          }),
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
            retry({
              count: +this.appConfig.retries,
              delay: +this.appConfig.retriesDelay,
              resetOnSuccess: true,
            }),
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
            retry({
              count: +this.appConfig.retries,
              delay: +this.appConfig.retriesDelay,
              resetOnSuccess: true,
            }),
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
            retry({
              count: +this.appConfig.retries,
              delay: +this.appConfig.retriesDelay,
              resetOnSuccess: true,
            }),
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

  async validatePoliza(trace: string, id: string) {
    const httpOptions = {
      headers: {
        apiKey: this.appConfig.apiKey,
        trace: trace,
      },
    }
    try {
      const response = await firstValueFrom(
        this.httpService
          .get(`${this.appConfig.dbBaseUrl}/${id}`, httpOptions)
          .pipe(
            retry({
              count: +this.appConfig.retries,
              delay: +this.appConfig.retriesDelay,
              resetOnSuccess: true,
            }),
          ),
      )
      const edad = response.data.edad
      const siniestros = response.data.siniestros

      if (edad >= 18) {
        const habilitado = true
        const calculoValor = +siniestros * 10000
        const informe = {
          habilitado: habilitado,
          valor: calculoValor,
        }
        return informe
      } else {
        const informe = 'Cliente cumple los requisitos necesarios'
        return {
          informe,
          response: response.data,
        }
      }
    } catch (error) {
      console.log(error)
      throw new BadRequestException(
        `Error listando los clientes : ${JSON.stringify(
          error.response?.data || error.message,
        )}`,
      )
    }
  }

  //   Service criterio poliza

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
