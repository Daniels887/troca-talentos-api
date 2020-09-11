import { Router } from 'express';
import multer from 'multer';

import UserController from '@controllers/UsersController';
import SessionControler from '@controllers/SessionController';

import TendersController from '@controllers/TendersController';
import TalentsController from '@controllers/TalentsController';
import SchedulesController from '@controllers/SchedulesController';
import multerConfig from './config/multer';
import authMiddleware from './middlewares/auth';

const router = Router();
const upload = multer(multerConfig);

router.post('/users', UserController.store);
router.post('/auth', SessionControler.store);

router.post('/forgotPassword', UserController.passwordRecovery);

router.use(authMiddleware);

router.get('/users', UserController.index);
router.patch('/user/:id', upload.single('file'), UserController.update);

router.get('/tender/:id', TendersController.index);
router.post('/tender', TendersController.store);

router.post('/talent', TalentsController.store);
router.get('/talent/:title', TalentsController.showUsersByTalent);

router.post('/schedule', SchedulesController.store);
router.get('/schedules/:id', SchedulesController.show_by_id);

export default router;
