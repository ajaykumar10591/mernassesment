require('dotenv').config();
const { generateAccessToken } = require('./jwt');
const { IUser } = require('../models/User');

const testUser = {
  _id: '64f8c0a2b3e2c8a1d2e4f5g6', // Replace with a valid user ID from your database
  name: 'Test User',
  email: 'test@example.com',
  role: 'admin',
  createdAt: new Date(),
  updatedAt: new Date(),
};

console.log(generateAccessToken(testUser));