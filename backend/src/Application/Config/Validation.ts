import * as Joi from 'joi';
import { ErrorWrapper } from '../../Common/Type/ErrorWrapper';
import { LoggingLevels } from '../../Common/Type/LoggingLevels';
import { NodeEnv } from '../../Common/Type/NodeEnv';
import { Config } from './Config';

const defaultHttpPort = 4000;
const configSchema = Joi.object<Config>({
  nodeEnv: Joi.string()
    .valid(...Object.values(NodeEnv))
    .required(),
  port: Joi.number().port().default(defaultHttpPort),
  logsPath: Joi.string().required(),
  consoleLoggingLevel: Joi.string()
    .valid(...Object.values(LoggingLevels))
    .required(),
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
  consoleLoggingLevel: configSource.CONSOLE_LOGGING_LEVEL,
});

class ConfigValidationError extends ErrorWrapper {}
