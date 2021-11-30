import swagger from 'express-swagger-generator';
import { TOKEN_COOKIE_NAME } from '../AppConstants';
import { config } from '../Config/Config';
import { IApp } from './IApp';

const options = {
  swaggerDefinition: {
    info: {
      description: 'API for CampaignKeeper frontends',
      title: 'CampaignKeeper API',
      version: '1.0.0',
    },
    host: `localhost:${config.port}`,
    basePath: '/api',
    produces: ['application/json'],
    schemes: ['http', 'https'],
    securityDefinitions: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: TOKEN_COOKIE_NAME,
        description: '',
      },
    },
  },
  basedir: __dirname, //app absolute path
  files: ['../../Application/**/*.js'],
};

export const setupDocumentationGenerator = (app: IApp): void => {
  const expressSwagger = swagger(app.getRouter());
  expressSwagger(options);
};
