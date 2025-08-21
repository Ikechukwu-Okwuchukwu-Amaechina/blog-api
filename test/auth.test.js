const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');


describe('Auth routes', () => {
  test('POST /api/auth/signup creates a user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'Test User', email: 'test@example.com', password: 'pass123' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('email', 'test@example.com');
  });

  test('POST /api/auth/login returns a token for valid credentials', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({ name: 'Login User', email: 'login@example.com', password: 'pass123' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@example.com', password: 'pass123' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
