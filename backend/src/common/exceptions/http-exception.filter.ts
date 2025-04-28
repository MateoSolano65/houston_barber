import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { Response } from 'express';

import { ExecModes } from '../enums';

import { envs } from '@config/envs';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor() {}

  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status: HttpStatus =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const isInternalServerError = status === HttpStatus.INTERNAL_SERVER_ERROR;
    const isProdEnvironment = envs.nodeEnv !== ExecModes.LOCAL;

    if (isInternalServerError && !isProdEnvironment) {
      this.logger.error(exception.message, exception.stack);
    }

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : 'Internal server error';

    const message = this.extractMessage(exceptionResponse);

    return response.status(status).json({ message });
  }

  private extractMessage(response: unknown): string | string[] {
    if (typeof response === 'object' && 'message' in response!) {
      return response.message as string | string[];
    }

    return response as string;
  }
}
