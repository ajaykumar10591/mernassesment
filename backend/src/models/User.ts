import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user';
  googleId?: string;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  avatar: {
    type: String,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  googleId: {
    type: String,
    sparse: true,
  },
  refreshToken: {
    type: String,
  },
}, {
  timestamps: true,
});

export const User = mongoose.model<IUser>('User', userSchema);