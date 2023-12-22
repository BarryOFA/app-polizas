import { CreateVehiculoDto } from './create.dto'
import { PartialType } from '@nestjs/swagger'

export class UpdateVehiculoDto extends PartialType(CreateVehiculoDto) {}
