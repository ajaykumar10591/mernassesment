import { Router } from 'express';
import { googleLogin, refreshToken, logout, getProfile } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/google', googleLogin);
router.post('/refresh', refreshToken);
router.post('/logout', authenticate, logout);
router.get('/profile', authenticate, getProfile);

export default router;