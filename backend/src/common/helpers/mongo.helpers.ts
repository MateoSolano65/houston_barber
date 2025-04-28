import { Types } from 'mongoose';
import { NextFunction } from 'express';

export type PopulatedEntity<T> = Types.ObjectId | (T & { _id: Types.ObjectId });

import { ConflictException, UnprocessableEntityException } from '@nestjs/common';

interface MongoError {
  name: string;
  code?: number;
  keyPattern?: Record<string, number>;
  keyValue?: Record<string, unknown>;
  errors?: Record<string, unknown>;
}

export function validateMongo<T>(error: MongoError, document: T, next: NextFunction): void {
  try {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      const duplicatedKey = Object.keys(error.keyPattern ?? {})[0];
      const duplicatedValue = error.keyValue?.[duplicatedKey] as string;

      const message = `There is already a registry with the same ${duplicatedKey} : ${duplicatedValue}`;

      next(new ConflictException(message));
    }

    if (error.name === 'ValidationError') {
      next(
        new UnprocessableEntityException(
          `Fields: ${Object.keys(error.errors ?? {}).join(', ')} are required.`,
        ),
      );
    }

    next();
  } catch (error) {
    next(error);
  }
}
