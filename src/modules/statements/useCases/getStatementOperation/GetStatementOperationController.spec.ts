import request from 'supertest';
import { v4 as uuidV4 } from 'uuid';
import { createConnection, Connection } from 'typeorm';
import { app } from '../../../../app';


let connection: Connection;
let token: string;


describe('GET /api/v1/statements/:id', () => {

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

  it('should be able to list a statement. ', async () => {
    const responseStatement = await request(app)
      .post('/api/v1/statements/deposit')
      .send({ amount: 500, description: 'salário' })
      .set({
        Authorization: `Bearer ${token}`
      });

    const response = await request(app)
      .get(`/api/v1/statements/${responseStatement.body.id}`)
      .send()
      .set({
        Authorization: `Bearer ${token}`
      });

    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(responseStatement.body.id);
  });

  it('should not be able to list a statement non-existent user.', async () => {

    const response = await request(app)
    .get(`/api/v1/statements/${uuidV4()}`)
    .send();

    expect(response.status).toBe(401);
  });

  it('should not be able to list a non-existent statement.', async () => {

    const response = await request(app)
      .get(`/api/v1/statements/${uuidV4()}`)
      .send()
      .set({
        Authorization: `Bearer ${token}`
      });

    console.log(response.body);

    expect(response.status).toBe(404);
  });

});
