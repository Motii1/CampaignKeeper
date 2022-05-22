/* eslint-disable @typescript-eslint/no-var-requires */
const { SnakeNamingStrategy } = require('typeorm-naming-strategies');

const defaultConfig = {
  type: 'mssql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  cache:
    process.env.NODE_ENV === 'development' // temporary disabled for production due to costs related to redis cache in cloud
      ? {
          type: 'redis',
          options: {
            host: process.env.CACHE_HOST,
            port: +process.env.CACHE_PORT,
            password: process.env.CACHE_PASSWORD,
          },
        }
      : undefined,
  extra: {
    trustServerCertificate: process.env.NODE_ENV !== 'production',
  },
  namingStrategy: new SnakeNamingStrategy(),
  entities: ['dist/Infrastracture/Entity/**/*.js'],
  migrations: ['dist/Infrastracture/Migration/**/*.js'],
  subscribers: ['dist/Infrastracture/Subscriber/**/*.js'],
  cli: {
    entitiesDir: 'src/Infrastracture/Entity',
    migrationsDir: 'src/Infrastracture/Migration',
    subscribersDir: 'src/Infrastracture/Subscriber',
  },
};

const testConfig = {
  type: 'sqlite',
  database: ':memory:',
  synchronize: true,
  logging: false,
  entities: ['dist/Infrastracture/Entity/**/*.js', 'src/Infrastracture/Entity/**/*.ts'],
  migrations: ['dist/Infrastracture/Migration/**/*.js'],
  subscribers: ['dist/Infrastracture/Subscriber/**/*.js'],
  cli: {
    entitiesDir: 'src/Infrastracture/Entity',
    migrationsDir: 'src/Infrastracture/Migration',
    subscribersDir: 'src/Infrastracture/Subscriber',
  },
  namingStrategy: new SnakeNamingStrategy(),
};

const selectedConfig = process.env.NODE_ENV === 'test' ? testConfig : defaultConfig;

module.exports = selectedConfig;
