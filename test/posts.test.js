const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
;

describe('Posts routes (minimal)', () => {
  test('GET /api/posts returns empty list when no posts', async () => {
    const res = await request(app).get('/api/posts');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('posts');
    expect(Array.isArray(res.body.posts)).toBe(true);
    expect(res.body.posts.length).toBe(0);
  });

  test('POST /api/posts requires auth and allows creating a post with valid token', async () => {
    await request(app).post('/api/auth/signup').send({ name: 'P', email: 'p@example.com', password: 'pass123' });
    const login = await request(app).post('/api/auth/login').send({ email: 'p@example.com', password: 'pass123' });
    const token = login.body.token;

    const unauth = await request(app).post('/api/posts').send({ title: 'T', body: 'B' });
    expect(unauth.statusCode).toBe(401);

    const res = await request(app).post('/api/posts').set('Authorization', `Bearer ${token}`).send({ title: 'My Post', body: 'Content' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('post');
    expect(res.body.post).toHaveProperty('title', 'My Post');
  });
});
