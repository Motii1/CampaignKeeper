import { createConnection, getConnection, getConnectionOptions } from 'typeorm';

export const initDb = async (): Promise<void> => {
  const options = await getConnectionOptions();
  const conn = await createConnection(options);
  await conn.synchronize(true);
};

export const dropDb = async (): Promise<void> => await getConnection().close();
