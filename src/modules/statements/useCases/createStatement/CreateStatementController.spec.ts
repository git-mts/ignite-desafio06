import request from 'supertest';
import { createConnection, Connection } from 'typeorm';
import { app } from '../../../../app';


let connection: Connection;
let token: string;


describe('POST /api/v1/statements', () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await request(app)
      .post('/api/v1/users')
      .send({ name: 'Test', email: 'user@test.com.br', password: 'test' });

    token = (await request(app).post('/api/v1/sessions').send({
      email: 'user@test.com.br', password: 'test'
    })).body.token;
  });


  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should not be able to create a new statement.', async () => {
    const response = await request(app)
      .post('/api/v1/statements/deposit')
      .send({ amount: 500, description: 'salário' })
      .set({
        Authorization: `Bearer ${token}`
      });

    expect(response.status).toBe(201);
  });

  it('should not be able to create a new statement with non-existent user.', async () => {
    const response = await request(app)
      .post('/api/v1/statements/deposit')
      .send({ amount: 500, description: 'salário' })

    expect(response.status).toBe(401);

  });

  it('should not be able to create a new withdrawal with insufficient balance.', async () => {

    const response = await request(app)
      .post('/api/v1/statements/withdraw')
      .send({ amount: 700, description: 'salário' })
      .set({
        Authorization: `Bearer ${token}`
      });

    expect(response.status).toBe(400);
  });

});
