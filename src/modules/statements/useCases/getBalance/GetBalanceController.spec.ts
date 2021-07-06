import request from 'supertest';
import { createConnection, Connection } from 'typeorm';
import { app } from '../../../../app';


let connection: Connection;
let token: string;


describe('GET /api/v1/statements/balance', () => {

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

  it('should be able to list a user balance. ', async () => {
    await request(app)
      .post('/api/v1/statements/deposit')
      .send({ amount: 500, description: 'salário' })
      .set({
        Authorization: `Bearer ${token}`
      });

    await request(app)
      .post('/api/v1/statements/withdraw')
      .send({ amount: 200, description: 'salário' })
      .set({
        Authorization: `Bearer ${token}`
      });

    const response = await request(app)
      .get('/api/v1/statements/balance')
      .send({ amount: 200, description: 'salário' })
      .set({
        Authorization: `Bearer ${token}`
      });

    expect(response.status).toBe(200);
    expect(response.body.statement.length).toBe(2);
    expect(response.body.balance).toBe(300);
  });

  it('should not be able to list the balance of a non-existent user. ', async () => {

    const response = await request(app)
    .get('/api/v1/statements/balance')
    .send({ amount: 200, description: 'salário' });

    expect(response.status).toBe(401);
  });

});
