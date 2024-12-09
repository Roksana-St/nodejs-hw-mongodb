import express from 'express';
import { register, login, refreshSession, logout } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { userSchema, loginSchema } from '../utils/schemas.js';

const router = express.Router();

router.post('/register', validateBody(userSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/refresh', refreshSession);
router.post('/logout', logout);

export default router;
