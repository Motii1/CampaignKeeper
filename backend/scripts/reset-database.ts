/* eslint-disable no-console */
import { exec } from 'child_process';
import fs from 'fs/promises';
import { join } from 'path';
import { createConnection, EntityManager } from 'typeorm';
import { config } from '../src/Application/Config/Config';

const seed = async (entityManager: EntityManager): Promise<void> => {
  const files = await fs.readdir(__dirname);
  const sqlScripts = files.filter(filename => filename.split('.')[1] === 'sql');
  await Promise.all(
    sqlScripts.map(async sql => {
      const data = await fs.readFile(join(__dirname, sql));
      const table = sql.replace('campaign_keeper_db_dbo_', '').split('.')[0];
      const query =
        table !== 'event_children_event'
          ? `SET IDENTITY_INSERT "${table}" ON; ${data.toString()}`
          : data.toString();
      await entityManager.query(query);
    })
  );
};

const turnOffConstraints = async (entityManager: EntityManager): Promise<void> => {
  await entityManager.query('EXEC sp_msforeachtable "ALTER TABLE ? NOCHECK CONSTRAINT all";');
};

const turnOnConstraints = async (entityManager: EntityManager): Promise<void> => {
  await entityManager.query(
    'EXEC sp_msforeachtable "ALTER TABLE ? WITH CHECK CHECK CONSTRAINT all";'
  );
};

const clearDb = async (entityManager: EntityManager): Promise<void> => {
  await entityManager.query(`
  DECLARE @sql NVARCHAR(2000)

  WHILE(EXISTS(SELECT 1 from INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_TYPE='FOREIGN KEY'))
  BEGIN
      SELECT TOP 1 @sql=('ALTER TABLE ' + CONSTRAINT_SCHEMA + '.[' + TABLE_NAME + '] DROP CONSTRAINT [' + CONSTRAINT_NAME + ']')
      FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
      WHERE CONSTRAINT_TYPE = 'FOREIGN KEY'
      EXEC(@sql)
      PRINT @sql
  END
  
  WHILE(EXISTS(SELECT * from INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME != '__MigrationHistory' AND TABLE_NAME != 'database_firewall_rules' AND TABLE_NAME != 'ipv6_database_firewall_rules'))
  BEGIN
      SELECT TOP 1 @sql=('DROP TABLE ' + CONSTRAINT_SCHEMA  + '.[' + TABLE_NAME + ']')
      FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
      WHERE TABLE_NAME != '__MigrationHistory' AND TABLE_NAME != 'database_firewall_rules'
      EXEC(@sql)
      PRINT @sql
  END
  `);
  return new Promise((resolve, reject) => {
    exec('npm run migration:run', (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
};

(async () => {
  try {
    const connection = await createConnection({
      type: 'mssql',
      host: config.dbHost,
      port: config.dbPort,
      username: config.dbUser,
      password: config.dbPassword,
      database: config.dbName,
      options: { encrypt: false },
      multipleStatements: true,
    } as any);
    console.info('Starting to seed sql...');
    await clearDb(connection.manager);
    await turnOffConstraints(connection.manager);
    await seed(connection.manager);
    await turnOnConstraints(connection.manager);
    console.info('Finished the operation');
    process.exit(0);
  } catch (e) {
    console.error(`Something went wrong: ${e}`);
    process.exit(1);
  }
})();

/* eslint-enable */
