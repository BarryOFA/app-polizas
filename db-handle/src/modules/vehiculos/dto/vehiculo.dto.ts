import { Expose } from 'class-transformer'

export class VehiculosDto {
  @Expose()
  patente: string

  @Expose()
  marca: string

  @Expose()
  modelo: string

  @Expose()
  anio: number

  @Expose()
  rut_cliente: string
}
