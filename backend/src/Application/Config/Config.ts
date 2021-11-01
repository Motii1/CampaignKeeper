import dotenv from 'dotenv';
import { NodeEnv } from '../../Common/Type/NodeEnv';
import { validateConfig } from './Validation';

export type Config = {
  nodeEnv: NodeEnv;
  port: number;
  logsPath: string;
  consoleLoggingLevel: string;
  dbHost: string;
  dbUser: string;
  dbPassword: string;
  dbPort: number;
  dbName: string;
  cacheHost: string;
  cachePort: number;
  cachePassword: string;
  jwtSecret: string;
  frontendBuildPath: string;
};

dotenv.config();
export const config = validateConfig(process.env);
