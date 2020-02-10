import { createConnection, Connection } from 'typeorm';
import * as entities from 'entities';
import config from 'config';

export const createDatabaseConnection = (): Promise<Connection> =>
  createConnection({
    type: 'postgres',
    host: config.db.host,
    port: config.db.port,
    username: config.db.username,
    password: config.db.password,
    database: config.db.database,
    entities: Object.values(entities),
    synchronize: true,
  });

export const tryDbInit = async (): Promise<void> => {
  try {
    await createDatabaseConnection();
  } catch (error) {
    console.log(error);
  }
};