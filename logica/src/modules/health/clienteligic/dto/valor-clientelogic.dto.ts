import { IsNumber, IsPositive, Min } from 'class-validator'

export class ValorClientelogicDto {
  @IsNumber()
  @IsPositive()
  @Min(100000)
  pointsToAdd: number
}
