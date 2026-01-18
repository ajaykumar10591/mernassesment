import request from 'supertest';
import app from '../src/index';
import { User } from '../src/models/User';
import * as googleConfig from '../src/config/google';
import * as emailUtils from '../src/utils/sendEmail';

jest.mock('../src/config/google');
jest.mock('../src/utils/sendEmail');

const mockVerifyGoogleToken = googleConfig.verifyGoogleToken as jest.MockedFunction<typeof googleConfig.verifyGoogleToken>;
const mockSendWelcomeEmail = emailUtils.sendWelcomeEmail as jest.MockedFunction<typeof emailUtils.sendWelcomeEmail>;

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSendWelcomeEmail.mockResolvedValue();
  });

  describe('POST /api/auth/google', () => {
    it('should create new user and return tokens', async () => {
      const mockPayload = {
        sub: 'google123',
        email: 'test@example.com',
        name: 'Test User',
        picture: 'https://example.com/avatar.jpg',
      };

      mockVerifyGoogleToken.mockResolvedValue(mockPayload);

      const response = await request(app)
        .post('/api/auth/google')
        .send({ token: 'valid-google-token' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Account created successfully');
      expect(response.body.user.email).toBe('test@example.com');
      expect(mockSendWelcomeEmail).toHaveBeenCalledWith('test@example.com', 'Test User');
    });

    it('should login existing user', async () => {
      const user = new User({
        name: 'Existing User',
        email: 'existing@example.com',
        googleId: 'google123',
      });
      await user.save();

      const mockPayload = {
        sub: 'google123',
        email: 'existing@example.com',
        name: 'Existing User',
      };

      mockVerifyGoogleToken.mockResolvedValue(mockPayload);

      const response = await request(app)
        .post('/api/auth/google')
        .send({ token: 'valid-google-token' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login successful');
      expect(mockSendWelcomeEmail).not.toHaveBeenCalled();
    });

    it('should return error for invalid token', async () => {
      mockVerifyGoogleToken.mockRejectedValue(new Error('Invalid token'));

      const response = await request(app)
        .post('/api/auth/google')
        .send({ token: 'invalid-token' });

      expect(response.status).toBe(500);
    });
  });

  describe('GET /api/auth/profile', () => {
    it('should return user profile when authenticated', async () => {
      // Setup mock before making the login request
      mockVerifyGoogleToken.mockResolvedValue({
        sub: 'google123',
        email: 'test@example.com',
        name: 'Test User',
      });

      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        googleId: 'google123',
        role: 'user',
      });
      await user.save();

      const loginResponse = await request(app)
        .post('/api/auth/google')
        .send({ token: 'valid-google-token' });

      // Check if cookies were set
      const cookies = loginResponse.headers['set-cookie'];
      expect(cookies).toBeDefined();

      const response = await request(app)
        .get('/api/auth/profile')
        .set('Cookie', cookies);

      expect(response.status).toBe(200);
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get('/api/auth/profile');

      expect(response.status).toBe(401);
    });
  });
});