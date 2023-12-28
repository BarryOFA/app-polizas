import { CreateClienteDto } from './create-clientelogic.dto'
import { PartialType } from '@nestjs/swagger'

export class UpdateClienteDto extends PartialType(CreateClienteDto) {}
