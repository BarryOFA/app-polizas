import { CreateClienteDto } from './create.dto'
import { PartialType } from '@nestjs/swagger'

export class UpdateClienteDto extends PartialType(CreateClienteDto) {}
