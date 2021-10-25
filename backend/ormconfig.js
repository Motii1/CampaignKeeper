/* eslint-disable @typescript-eslint/no-var-requires */
const { SnakeNamingStrategy } = require('typeorm-naming-strategies');

module.exports = {
  type: 'mssql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  cache: {
    type: 'redis',
    options: {
      host: process.env.CACHE_HOST,
      port: +process.env.CACHE_PORT,
    },
  },
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
