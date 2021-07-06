import request from 'supertest';
import { createConnection, Connection } from 'typeorm';
import { app } from '../../../../app';


describe('GET /api/v1/profile', () => {

  it('should be able to list the user profile.', async () => {
    const connection = await createConnection();
    await connection.runMigrations();

    await request(app)
    .post('/api/v1/users')
    .send({
      name: 'Test', email: 'user@test.com.br', password: 'test'
    });

    const { body: { token } } = await request(app)
    .post('/api/v1/sessions')
    .send({
      email: 'user@test.com.br', password: 'test'
    });

    const response = await request(app)
      .get('/api/v1/profile')
      .send().set({
        Authorization: `Bearer ${token}`
      });

    await connection.dropDatabase();
    await connection.close();

    expect(response.status).toBe(200);
    expect(response.body.email).toBe('user@test.com.br');
  });

  it('should not ble able to list the profile a non-existent user.', async () => {

    const connection = await createConnection();
    await connection.runMigrations();

    const response = await request(app).get('/api/v1/profile');

    await connection.dropDatabase();
    await connection.close();

    expect(response.status).toBe(401);

  });

});
