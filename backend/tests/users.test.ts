import request from 'supertest';
import app from '../src/index';
import { User } from '../src/models/User';
import { generateAccessToken } from '../src/utils/jwt';
import * as emailUtils from '../src/utils/sendEmail';

jest.mock('../src/utils/sendEmail');

const mockSendWelcomeEmail = emailUtils.sendWelcomeEmail as jest.MockedFunction<typeof emailUtils.sendWelcomeEmail>;

describe('User Routes', () => {
  let adminUser: any;
  let regularUser: any;
  let adminToken: string;
  let userToken: string;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockSendWelcomeEmail.mockResolvedValue();

    adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
    });
    await adminUser.save();

    regularUser = new User({
      name: 'Regular User',
      email: 'user@example.com',
      role: 'user',
    });
    await regularUser.save();

    adminToken = generateAccessToken(adminUser);
    userToken = generateAccessToken(regularUser);
  });

  describe('GET /api/users', () => {
    it('should return users list for authenticated user', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.users).toHaveLength(2);
      expect(response.body.pagination).toBeDefined();
    });

    it('should support search functionality', async () => {
      const response = await request(app)
        .get('/api/users?search=admin')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.users).toHaveLength(1);
      expect(response.body.users[0].email).toBe('admin@example.com');
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get('/api/users');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/users', () => {
    it('should create user when admin', async () => {
      const userData = {
        name: 'New User',
        email: 'new@example.com',
        role: 'user',
      };

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.user.email).toBe('new@example.com');
      expect(mockSendWelcomeEmail).toHaveBeenCalledWith('new@example.com', 'New User');
    });

    it('should return 403 when regular user tries to create', async () => {
      const userData = {
        name: 'New User',
        email: 'new@example.com',
      };

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${userToken}`)
        .send(userData);

      expect(response.status).toBe(403);
    });

    it('should return 400 for duplicate email', async () => {
      const userData = {
        name: 'Duplicate User',
        email: 'admin@example.com',
      };

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User already exists');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user when admin', async () => {
      const updateData = {
        name: 'Updated Name',
        email: 'updated@example.com',
      };

      const response = await request(app)
        .put(`/api/users/${regularUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.user.name).toBe('Updated Name');
      expect(response.body.user.email).toBe('updated@example.com');
    });

    it('should return 403 when regular user tries to update', async () => {
      const response = await request(app)
        .put(`/api/users/${adminUser._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Hacked' });

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete user when admin', async () => {
      const response = await request(app)
        .delete(`/api/users/${regularUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User deleted successfully');
    });

    it('should return 403 when regular user tries to delete', async () => {
      const response = await request(app)
        .delete(`/api/users/${adminUser._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });
  });
});