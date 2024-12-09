import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { login, refresh, logout } from '../controllers/auth.js';
import { userLoginSchema } from '../utils/schemas.js';

const router = express.Router();

router.post('/login', validateBody(userLoginSchema), login);

router.post('/refresh', refresh);

router.post('/logout', logout);

export default router;
