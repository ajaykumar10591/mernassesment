import { Request, Response } from 'express';
import { IUser } from '../models/User';
import { verifyGoogleToken } from '../config/google';
import { User } from '../models/User';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/jwt';
import { sendWelcomeEmail } from '../utils/sendEmail';

export const googleLogin = async (req: Request & { user?: IUser }, res: Response): Promise<void> => {
  try {
    const { token } = req.body;
    
    if (!token) {
      res.status(400).json({ message: 'Google token is required' });
      return;
    }

    const payload = await verifyGoogleToken(token);
    
    if (!payload || !payload.email) {
      res.status(400).json({ message: 'Invalid Google token' });
      return;
    }

    let user = await User.findOne({ email: payload.email });
    let isNewUser = false;

    if (!user) {
      user = new User({
        name: payload.name || 'Unknown',
        email: payload.email,
        avatar: payload.picture,
        googleId: payload.sub,
        role: 'user',
      });
      await user.save();
      isNewUser = true;
      
      // Send welcome email
      await sendWelcomeEmail(user.email, user.name);
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    // Cookie options: in development allow cross-site requests from frontend dev server
    const cookieOptions = {
      httpOnly: true,
      // Use secure cookies in production only
      secure: process.env.NODE_ENV === 'production',
      // For development (different origin localhost:3000 -> localhost:5000) set SameSite=None so XHR requests send cookies.
      // In production, keep 'lax' to be safer.
      sameSite: (process.env.NODE_ENV === 'production' ? ('lax' as const) : ('none' as const)),
      maxAge: 15 * 60 * 1000, // 15 minutes
    };

    res.cookie('accessToken', accessToken, cookieOptions);

    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: isNewUser ? 'Account created successfully' : 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const refreshToken = async (req: Request & { user?: IUser }, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      res.status(401).json({ message: 'Refresh token not provided' });
      return;
    }

    const decoded = verifyToken(refreshToken);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      res.status(401).json({ message: 'Invalid refresh token' });
      return;
    }

    const newAccessToken = generateAccessToken(user);

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: 'Token refreshed successfully' });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

export const logout = async (req: Request & { user?: IUser }, res: Response): Promise<void> => {
  try {
    if (req.user) {
      req.user.refreshToken = undefined;
      await req.user.save();
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProfile = async (req: Request & { user?: IUser }, res: Response): Promise<void> => {
  res.json({
    user: {
      id: req.user!._id,
      name: req.user!.name,
      email: req.user!.email,
      avatar: req.user!.avatar,
      role: req.user!.role,
    },
  });
};