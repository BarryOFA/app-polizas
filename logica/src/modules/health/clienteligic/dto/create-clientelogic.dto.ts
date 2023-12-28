import { IsString, IsNumber, IsOptional, Min } from 'class-validator'

export class CreateClienteDto {
  @IsString()
  rut: string

  @IsString()
  nombre: string

  @IsNumber()
  edad: number

  @IsNumber()
  historial_sinistros: number

  @IsString()
  patente: string

  @IsString()
  marca: string

  @IsString()
  modelo: string

  @IsNumber()
  anio: number

  @IsOptional()
  @Min(100000)
  @IsNumber()
  valor: number
}
