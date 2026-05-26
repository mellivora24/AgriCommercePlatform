import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { beforeAll, describe, expect, it } from '@jest/globals';

import { AppModule } from '../src/app.module';

describe('Users Module (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let createdUserId: number;

  const testUser = {
    email: 'testuser@example.com',
    phone: '+84912345678',
    password: 'TestPassword@123',
  };

  const updatedUserData = {
    email: 'updated@example.com',
    phone: '+84987654321',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/register - Create User', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty('userId');
      expect(response.body).toHaveProperty('email', testUser.email);
      expect(response.body).toHaveProperty('phone', testUser.phone);
      expect(response.body).toHaveProperty('role', 'BUYER');
      expect(response.body).toHaveProperty('status', 'ACTIVE');

      createdUserId = response.body.userId;
    });

    it('should fail to register with invalid email', async () => {
      const invalidUser = {
        email: 'invalid-email',
        phone: '+84912345678',
        password: 'TestPassword@123',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(invalidUser)
        .expect(400);
    });

    it('should fail to register with invalid phone', async () => {
      const invalidUser = {
        email: 'newuser@example.com',
        phone: 'invalid-phone',
        password: 'TestPassword@123',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(invalidUser)
        .expect(400);
    });

    it('should fail to register with weak password', async () => {
      const invalidUser = {
        email: 'newuser@example.com',
        phone: '+84912345678',
        password: '123',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(invalidUser)
        .expect(400);
    });
  });

  describe('POST /auth/login - Login User', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('user');

      authToken = response.body.access_token;
    });

    it('should fail login with wrong password', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword@123',
        })
        .expect(401);
    });

    it('should fail login with non-existent email', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'TestPassword@123',
        })
        .expect(401);
    });
  });

  describe('GET /users/profile - Get User Profile', () => {
    it('should get user profile when authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('userId', createdUserId);
      expect(response.body).toHaveProperty('email', testUser.email);
      expect(response.body).toHaveProperty('phone', testUser.phone);
    });

    it('should fail to get profile without authentication', async () => {
      await request(app.getHttpServer())
        .get('/users/profile')
        .expect(401);
    });

    it('should fail to get profile with invalid token', async () => {
      await request(app.getHttpServer())
        .get('/users/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('PUT /users/profile - Update User Profile', () => {
    it('should update user profile successfully', async () => {
      const response = await request(app.getHttpServer())
        .put('/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedUserData)
        .expect(200);

      expect(response.body).toHaveProperty('email', updatedUserData.email);
      expect(response.body).toHaveProperty('phone', updatedUserData.phone);
    });

    it('should fail to update profile without authentication', async () => {
      await request(app.getHttpServer())
        .put('/users/profile')
        .send(updatedUserData)
        .expect(401);
    });

    it('should fail to update profile with invalid email format', async () => {
      const invalidData = {
        email: 'invalid-email',
      };

      await request(app.getHttpServer())
        .put('/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);
    });

    it('should update with only email', async () => {
      const emailOnlyData = {
        email: 'emailonly@example.com',
      };

      const response = await request(app.getHttpServer())
        .put('/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(emailOnlyData)
        .expect(200);

      expect(response.body).toHaveProperty('email', emailOnlyData.email);
    });

    it('should update with only phone', async () => {
      const phoneOnlyData = {
        phone: '+84911111111',
      };

      const response = await request(app.getHttpServer())
        .put('/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(phoneOnlyData)
        .expect(200);

      expect(response.body).toHaveProperty('phone', phoneOnlyData.phone);
    });
  });

  describe('DELETE /users/profile - Delete User Profile', () => {
    it('should delete user profile successfully', async () => {
      // Register another user for deletion test
      const newUser = {
        email: 'deleteme@example.com',
        phone: '+84998765432',
        password: 'DeleteMe@123',
      };

      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send(newUser);

      const deleteToken = (
        await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: newUser.email,
            password: newUser.password,
          })
      ).body.access_token;

      await request(app.getHttpServer())
        .delete('/users/profile')
        .set('Authorization', `Bearer ${deleteToken}`)
        .expect(200);

      // Verify user is deleted
      await request(app.getHttpServer())
        .get('/users/profile')
        .set('Authorization', `Bearer ${deleteToken}`)
        .expect(401);
    });

    it('should fail to delete profile without authentication', async () => {
      await request(app.getHttpServer())
        .delete('/users/profile')
        .expect(401);
    });
  });
});
