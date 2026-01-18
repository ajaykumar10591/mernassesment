import { Request, Response } from 'express';
import { User } from '../models/User';
import { sendWelcomeEmail } from '../utils/sendEmail';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const sort = req.query.sort as string || 'createdAt';
    const order = req.query.order as string || 'desc';
    
    const query = search 
      ? { 
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const sortObj: any = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;

    const users = await User.find(query)
      .select('-refreshToken')
      .sort(sortObj)
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    // Map mongoose documents to plain objects with `id` field expected by frontend
    const usersData = users.map(u => ({
      id: (u._id as any).toString(),
      name: u.name,
      email: u.email,
      role: u.role,
      avatar: u.avatar,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));

    res.json({
      users: usersData,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, role } = req.body;

    if (!name || !email) {
      res.status(400).json({ message: 'Name and email are required' });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // If request tries to create an admin, ensure there isn't already an admin in the system
    if (role === 'admin') {
      const existingAdmin = await User.findOne({ role: 'admin' });
      if (existingAdmin) {
        res.status(400).json({ message: 'Only one admin account is allowed' });
        return;
      }
    }

    const user = new User({
      name,
      email,
      role: role || 'user',
    });

    await user.save();
    await sendWelcomeEmail(user.email, user.name);

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: (user._id as any).toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: 'Email already exists' });
        return;
      }
    }

    // If attempting to set role to 'admin', ensure there is no other admin already
    if (role === 'admin') {
      const existingAdmin = await User.findOne({ role: 'admin' });
      if (existingAdmin && (existingAdmin._id as any).toString() !== id) {
        res.status(400).json({ message: 'Only one admin account is allowed' });
        return;
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    await user.save();

    res.json({
      message: 'User updated successfully',
      user: {
        id: (user._id as any).toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    await User.findByIdAndDelete(id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get total users count
    const totalUsers = await User.countDocuments();
    
    // Get new signups today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newSignups = await User.countDocuments({
      createdAt: { $gte: today }
    });
    
    // Get users created in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const usersLast30Days = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    // Get users created in the previous 30 days (for comparison)
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    const usersPrevious30Days = await User.countDocuments({
      createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
    });
    
    // Calculate growth percentage
    const growthPercentage = usersPrevious30Days > 0 
      ? Math.round(((usersLast30Days - usersPrevious30Days) / usersPrevious30Days) * 100)
      : 0;
    
    // Mock data for active sessions (in a real app, you'd track this differently)
    const activeSessions = Math.floor(Math.random() * 50) + 50;
    
    res.json({
      stats: {
        totalUsers,
        newSignups,
        activeSessions,
        growthPercentage,
        systemStatus: 'operational'
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};