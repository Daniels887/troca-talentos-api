import 'reflect-metadata';
import express from 'express';
import './database/connect';
import path from 'path';
import cors from 'cors';
import routes from './routes';

class App {
  public server: express.Application

  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'temp', 'uploads')),
    );
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
