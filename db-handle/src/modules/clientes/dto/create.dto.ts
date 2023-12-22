import { IsString, IsNumber } from 'class-validator'

export class CreateClienteDto {
  @IsString()
  rut: string

  @IsString()
  nombre: string

  @IsNumber()
  edad: number

  @IsNumber()
  historial_sinistros: number
}
