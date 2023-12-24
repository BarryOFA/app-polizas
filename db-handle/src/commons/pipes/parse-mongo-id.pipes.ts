/* eslint-disable prettier/prettier */
import {
    ArgumentMetadata,
    Injectable,
    PipeTransform,
    BadRequestException,
  } from '@nestjs/common';
  import { isValidObjectId } from 'mongoose';
  
  @Injectable()
  export class ParseMongoIdPipe implements PipeTransform {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform(value: string, metadata: ArgumentMetadata) {
      if (!isValidObjectId(value)) {
        throw new BadRequestException('Invalid ID!');
      }
      return value;
    }
  }