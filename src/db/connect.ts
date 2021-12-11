import config from 'config';
import mongoose from 'mongoose';
import { log } from '../logger';

export const connect = (): Promise<void> => {
  const dbUri = config.get('dbUri') as string;
  return mongoose
    .connect(dbUri)
    .then(() => log.info('Database connected'))
    .catch((error) => {
      log.error('DB error', error);
      process.exit(1);
    });
};
