import request from 'supertest';
import { createConnection, Connection } from 'typeorm';
import { app } from '../../../../app';


let connection: Connection;


describe('POST /api/v1/users', () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });


  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });


  it('should be able to create a new user.', async () => {

    const response = await request(app)
      .post('/api/v1/users')
      .send({
        name: 'Test', email: 'user@test.com.br', password: 'test'
      });

      expect(response.status).toBe(201);
  });

  it('should not be able to crate a new user with e-mail already registered.', async () => {

    const response = await request(app).post('/api/v1/users').send({
      name: 'Test', email: 'user@test.com.br', password: 'test'
    })

    expect(response.status).toBe(400);

  });
});
