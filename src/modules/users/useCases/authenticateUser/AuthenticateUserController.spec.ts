import request from 'supertest';
import { createConnection, Connection } from 'typeorm';
import { app } from '../../../../app';


let connection: Connection;


describe('POST /api/v1/sessions', () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });


  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });


  it('should be able to authenticate the user.', async () => {

    await request(app)
    .post('/api/v1/users')
    .send({
      name: 'Test', email: 'user@test.com.br', password: 'test'
    });

    const response = await request(app)
      .post('/api/v1/sessions')
      .send({
        email: 'user@test.com.br', password: 'test'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should not be able to authenticate the user with non-existent email.', async () => {

    const response = await request(app).post('/api/v1/sessions').send({
      email: 'incorrect@email.com', password: 'test'
    })

    expect(response.status).toBe(401);

  });

  it('should not be able to authenticate the user with wrong password.', async () => {

    const response = await request(app).post('/api/v1/sessions').send({
      email: 'user@test.com.br', password: 'wrong-password'
    })

    expect(response.status).toBe(401);

  });
});
