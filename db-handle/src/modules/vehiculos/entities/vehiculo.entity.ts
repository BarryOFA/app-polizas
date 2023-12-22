import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema()
export class Vehiculo extends Document {
  @Prop({
    required: true,
    unique: true,
  })
  patente: string

  @Prop({
    required: true,
  })
  marca: string

  @Prop({
    required: true,
  })
  modelo: string

  @Prop({
    required: true,
  })
  anio: number

  @Prop({
    required: true,
  })
  rut_cliente: string
}

export const VehiculoSchema = SchemaFactory.createForClass(Vehiculo)
