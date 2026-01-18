import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';

export const generateAccessToken = (user: IUser): string => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email, 
      role: user.role 
    },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' }
  );
};

export const generateRefreshToken = (user: IUser): string => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN ? parseInt(process.env.JWT_EXPIRES_IN, 10) : '7d' }
  );
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};