import { NextFunction, Request, Response } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';

import { envs } from '@config/envs';

import { ExecModes } from '../enums';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (envs.nodeEnv !== ExecModes.PROD) {
      console.log('##########################################################################');
      console.log('DATE:', new Date().toISOString());
      console.log('PATH:', req.baseUrl);
      console.log('HEADERS:', req.headers);
      console.log('METHOD:', req.method);
      console.log('BODY:', req.body);
      console.log('QUERIES:', req.query);
      console.log('PARAMS:', req.params);
    }
    next();
  }
}
