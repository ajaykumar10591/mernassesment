import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser, getDashboardStats } from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getUsers);
router.get('/stats', getDashboardStats);
router.post('/', authorize(['admin']), createUser);
router.put('/:id', authorize(['admin']), updateUser);
router.delete('/:id', authorize(['admin']), deleteUser);

export default router;