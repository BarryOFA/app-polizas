import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Vehiculo } from './entities/vehiculo.entity'
import { CreateVehiculoDto } from './dto/create.dto'
import { UpdateVehiculoDto } from './dto/update.dto'
@Injectable()
export class VehiculosService {
  constructor(
    @InjectModel('Vehiculo') private readonly VehiculoModel: Model<Vehiculo>,
  ) {}

  async create(Vehiculo: CreateVehiculoDto): Promise<any> {
    const createdVehiculo = new this.VehiculoModel(Vehiculo)
    return await createdVehiculo.save()
  }

  async findAll(): Promise<any> {
    return await this.VehiculoModel.find().exec()
  }

  async findOne(id: string): Promise<any> {
    return await this.VehiculoModel.findById(id).exec()
  }

  async update(id: string, Vehiculo: UpdateVehiculoDto): Promise<Vehiculo> {
    const existingVehiculo = await this.VehiculoModel.findByIdAndUpdate(
      id,
      Vehiculo,
      { new: true },
    )

    if (!existingVehiculo) {
      throw new NotFoundException(`Vehiculo con ID ${id} no encontrado`)
    }

    return existingVehiculo
  }

  async delete(id: string): Promise<any> {
    return await this.VehiculoModel.findByIdAndDelete(id).exec()
  }
}
