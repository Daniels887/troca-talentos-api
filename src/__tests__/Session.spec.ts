import { Connection, createConnection } from 'typeorm';

import request from 'supertest';
import app from '../app';

describe('testing endpoints of users', () => {
  let connection: Connection;

  beforeAll(async () => {
    connection = await createConnection();
  });

  beforeEach(async () => {
    await connection.synchronize(true);
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should auth a user', async () => {
    await request(app).post('/users').send({ email: 'teste@hotmail.com', password: '123445' });

    const response = await request(app).post('/auth').send({ email: 'teste@hotmail.com', password: '123445' });

    expect(response.body).toHaveProperty('token');
  });
});
