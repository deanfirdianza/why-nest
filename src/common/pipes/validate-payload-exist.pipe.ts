import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

Injectable();
export class ValidatePayloadExistPipe implements PipeTransform {
  transform(payload: any): any {
    // * This will throw an error, if the payload object is empty.
    if (!Object.keys(payload).length) {
      throw new BadRequestException('Payload or Query should not be empty');
    }
    return payload;
  }
}
