import * as Joi from 'joi';
import { ErrorWrapper } from '../../Common/Type/ErrorWrapper';
import { NodeEnv } from '../../Common/Type/NodeEnv';
import { Config } from './Config';

const defaultHttpPort = 4000;
const configSchema = Joi.object<Config>({
  nodeEnv: Joi.string()
    .valid(...Object.values(NodeEnv))
    .required(),
  port: Joi.number().port().default(defaultHttpPort),
  logsPath: Joi.string(),
});

export const validateConfig = (configSource: Record<string, unknown>): Config => {
  const preparedConfig = prepareConfig(configSource);
  const { error, value: validatedConfig } = configSchema.validate(preparedConfig);
  if (error) {
    throw new ConfigValidationError(error.message);
  }
  return validatedConfig;
};

const prepareConfig = (configSource: Record<string, unknown>): Record<keyof Config, unknown> => ({
  nodeEnv: configSource.NODE_ENV,
  port: configSource.PORT,
  logsPath: configSource.LOGS_PATH,
});

class ConfigValidationError extends ErrorWrapper {}
