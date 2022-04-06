require('dotenv-safe').config();
import 'reflect-metadata';
import express from 'express';
import { createDatabaseConnection } from './util/createDatabaseConnection';
import * as bodyParser from 'body-parser';
import { globalRouter } from './router/global.router';
import morgan from 'morgan';

process.on('uncaughtException', function (exception) {
  console.log(exception);
});

const port = Number(process.env.PORT);
export const startServer = async () => {
  try {
    console.log(`Server is running in ${process.env.NODE_ENV} mode.`);

    const app = express();
    const dbConnection = await createDatabaseConnection();

    app.use(bodyParser.json());
    app.use(morgan('combined'));
    app.use('/api', globalRouter); // Router connection

    const server = app.listen(port, () => console.log(`Server is running on port ${port}`));
    return { server, dbConnection };
  } catch (e) {
    console.log(e);
    throw e;
  }
};

// tslint:disable-next-line: no-floating-promises
void startServer();
