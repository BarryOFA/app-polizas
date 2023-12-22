import { Expose } from 'class-transformer'

export class ClientesDto {
  @Expose()
  rut: string

  @Expose()
  nombre: string

  @Expose()
  edad: number

  @Expose()
  historial_sinistros: number
}
