import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema()
export class Cliente extends Document {
  @Prop({
    required: true,
    unique: true,
  })
  rut: string

  @Prop({
    required: true,
  })
  nombre: string

  @Prop({
    required: true,
  })
  edad: number

  @Prop({
    required: true,
  })
  historial_sinistros: number
}

export const ClienteSchema = SchemaFactory.createForClass(Cliente)
