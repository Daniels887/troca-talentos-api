import { Router } from 'express';
import multer from 'multer';

import UserController from '@controllers/UsersController';
import SessionControler from '@controllers/SessionController';

import ProposalsController from '@controllers/ProposalsController';
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

router.get('/proposal/:id', ProposalsController.index);
router.post('/proposal', ProposalsController.store);
router.patch('/accept/:id_proposal', ProposalsController.acceptProposal);

router.post('/talent', upload.single('file'), TalentsController.store);
router.patch('/talent/:id', upload.single('file'), TalentsController.update);
router.get('/talent/:user_id/:title?', TalentsController.showUsersByTalent);
router.get('/talent/detail/:id', TalentsController.show_by_id);
router.get('/talents/:user_id', TalentsController.my_talents);

router.post('/schedule', SchedulesController.store);
router.get('/schedules/:id', SchedulesController.show_by_id);
router.delete('/schedule/:id', SchedulesController.delete);

router.post('/finish/schedule/:id', SchedulesController.finish);

router.get('/notifications/:id', SchedulesController.show_last);

export default router;
