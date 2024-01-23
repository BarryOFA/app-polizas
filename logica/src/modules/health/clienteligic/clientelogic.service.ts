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
    try {
      const response = await firstValueFrom(
        this.httpService
          .post(
            `${this.appConfig.dbBaseUrl}`,
            createClienteDto,
            this.getHttpOptions(trace),
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
      this.handleExceptions(error)
    }
  }

  async findAll(trace: string, paginationDto: PaginationDto) {
    const httpOptions = {
      ...this.getHttpOptions(trace),
      params: paginationDto,
    }
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.appConfig.dbBaseUrl}`, httpOptions).pipe(
          retry({
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
    try {
      const response = await firstValueFrom(
        this.httpService
          .get(
            `${this.appConfig.dbBaseUrl}/${term}`,
            this.getHttpOptions(trace),
          )
          .pipe(
            retry({
              count: +this.appConfig.retries,
              delay: +this.appConfig.retriesDelay,
              resetOnSuccess: true,
            }),
          ),
      )
      return response.data.data
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
    try {
      const response = await firstValueFrom(
        this.httpService
          .patch(
            `${this.appConfig.dbBaseUrl}/${id}`,
            updateClienteDto,
            this.getHttpOptions(trace),
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
    try {
      const response = await firstValueFrom(
        this.httpService
          .delete(
            `${this.appConfig.dbBaseUrl}/${id}`,
            this.getHttpOptions(trace),
          )
          .pipe(
            retry({
              count: +this.appConfig.retries,

              delay: +this.appConfig.retriesDelay,
              resetOnSuccess: true,
            }),
          ),
      )
      return response.data.data
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
      const historialSinistros = response.data.historial_sinistros

      if (edad >= 18) {
        let aumento = 0
        switch (historialSinistros) {
          case 1:
            aumento = 0.1
            break
          case 2:
            aumento = 0.2
            break
          case 3:
            aumento = 0.3
            break
          default:
            aumento = 0
            break
        }

        const valorAumentado = historialSinistros * 10000 * (1 + aumento)
        const informe = {
          habilitado: true,
          valor: valorAumentado,
        }
        return informe
      } else {
        const informe = 'El cliente es apto para la poliza'
        return {
          informe,
          response: response.data.data,
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

  // private getIncrementHistorical(increment: number) {
  //   const INCREMENTO_HISTORIAL = {
  //     1: 0.1,
  //     2: 0.2,
  //     3: 0.3,
  //   }

  //   let aumento = INCREMENTO_HISTORIAL[increment]

  //   if (aumento === undefined) {
  //     console.error('Valor de increment no válido')
  //     // Puedes manejar este caso devolviendo un valor predeterminado o lanzando una excepción, según tus necesidades.
  //   }

  //   return aumento
  // }

  private getHttpOptions(trace: string) {
    return {
      headers: {
        apiKey: this.appConfig.apiKey,
        trace: trace,
      },
    }
  }
}
