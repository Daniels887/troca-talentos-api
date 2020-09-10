import 'reflect-metadata';
import express from 'express';
import './database/connect';
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
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
