import { Router } from 'express';

import UserController from '@controllers/UsersController';
import SessionControler from '@controllers/SessionControler';

import TendersController from '@controllers/TendersController';
import authMiddleware from './middlewares/auth';

const router = Router();

router.post('/users', UserController.store);
router.post('/auth', SessionControler.store);

router.use(authMiddleware);

router.get('/users', UserController.index);

router.get('/tender/:id', TendersController.index);
router.post('/tender', TendersController.store);

export default router;
