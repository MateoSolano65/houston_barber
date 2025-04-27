import { config } from 'dotenv';
import * as joi from 'joi';
import { resolve } from 'path';

import { ExecModes } from '@common/enums';

const nodeEnv = (process.env.NODE_ENV?.trim() as ExecModes) || ExecModes.LOCAL;

const envFile = nodeEnv === ExecModes.PROD ? '.env' : `.env.${nodeEnv}`;

const envPath = resolve(process.cwd(), envFile);

config({ path: envPath });

interface EnvVars {
  PORT: number;
  NODE_ENV: ExecModes;
  DB_URL: string;

  URLS_FRONTEND: string[];
}

const envSchema = joi
  .object({
    PORT: joi.number().default(3000),
    NODE_ENV: joi
      .string()
      .valid(...Object.values(ExecModes))
      .default(ExecModes.LOCAL),

    DB_URL: joi.string().required(),
    URLS_FRONTEND: joi.array().items(joi.string().uri()).required(),
  })
  .unknown(true);

const result = envSchema.validate(
  { ...process.env, URLS_FRONTEND: process.env.URLS_FRONTEND?.split(',') },
  { abortEarly: false },
);

const error = result.error;
const value = result.value as EnvVars;

if (error) throw new Error(`Config validation error: \n ${error.message}`);

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  nodeEnv,

  dbUrl: envVars.DB_URL,

  urlsFrontend: envVars.URLS_FRONTEND,
};
