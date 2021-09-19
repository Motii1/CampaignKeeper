import dotenv from 'dotenv';
import { NodeEnv } from '../../Common/Type/NodeEnv';
import { validateConfig } from './Validation';

export type Config = {
  nodeEnv: NodeEnv;
  port: number;
}

dotenv.config();
export const config = validateConfig(process.env);