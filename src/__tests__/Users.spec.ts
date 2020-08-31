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

  it('should create a user', async () => {
    const response = await request(app).post('/users').send({ email: 'teste@hotmail.com', password: '123445' });

    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toEqual('teste@hotmail.com');
    expect(response.body.password).not.toEqual('123445');
  });

  it('should get all users when set token', async () => {
    await request(app).post('/users').send({ email: 'teste@hotmail.com', password: '123445' });
    const { body } = await request(app).post('/auth').send({ email: 'teste@hotmail.com', password: '123445' });

    const response = await request(app).get('/users').set('Authorization', body.token);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].email).toEqual('teste@hotmail.com');
  });

  it('should not get all users when not set token', async () => {
    await request(app).post('/users').send({ email: 'teste@hotmail.com', password: '123445' });
    const response = await request(app).get('/users');

    expect(response.status).toEqual(401);
  });
});
