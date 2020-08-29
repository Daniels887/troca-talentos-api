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

  it('it should create a user', async () => {
    const response = await request(app).post('/users').send({ email: 'teste@hotmail.com', password: '123445' });

    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toEqual('teste@hotmail.com');
    expect(response.body.password).toEqual('123445');
  });
});
