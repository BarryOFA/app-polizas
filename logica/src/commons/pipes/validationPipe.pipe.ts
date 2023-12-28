import {
  ArgumentMetadata,
  PipeTransform,
  Injectable,
  HttpStatus,
  HttpException,
} from '@nestjs/common'
import { validate } from 'class-validator'
import { plainToClass } from 'class-transformer'
const { env } = process

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (!metadata.metatype || !this.toValidate(metadata.metatype)) {
      return value
    }

    const object = plainToClass(metadata.metatype, value)
    const errors = await validate(object, {
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })

    if (errors.length > 0) {
      const formattedErrors = this.formatErrors(errors)
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Parameters are not valid',
          errors: formattedErrors,
          from: env.APPLICATION_NAME,
        },
        HttpStatus.BAD_REQUEST,
      )
    }
    return value
  }

  private toValidate(metatype: unknown): boolean {
    const types: Array<new (...args: any[]) => any> = [
      String,
      Boolean,
      Number,
      Array,
      Object,
    ]
    return !types.includes(metatype as any)
  }

  private formatErrors(errors: any[]) {
    return errors.reduce((acc, err) => {
      acc[err.property] = Object.values(err.constraints)
      return acc
    }, {})
  }
}
