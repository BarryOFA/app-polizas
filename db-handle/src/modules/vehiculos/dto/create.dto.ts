import { IsString, IsNumber } from 'class-validator'

export class CreateVehiculoDto {
  @IsString()
  patente: string

  @IsString()
  marca: string

  @IsString()
  modelo: string

  @IsNumber()
  anio: number

  @IsString()
  rut_cliente: string
}
