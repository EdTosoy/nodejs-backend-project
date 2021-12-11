import express from 'express';
import dotenv from 'dotenv';
import config from 'config';
import { log } from './logger';
import { connect } from './db/connect';
import { routes } from './routes';

dotenv.config();

const app = express();

const port = config.get('port') as number;
const host = config.get('host') as string;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(port, host, () => {
  log.info(`application is running at http://${host}:${port}`);
  connect();
  routes(app);
});
