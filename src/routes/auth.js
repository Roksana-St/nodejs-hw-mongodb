import express from 'express';
import { register, login, refreshSession, logout, sendResetEmail, resetPassword, getGoogleOAuthUrlController, loginWithGoogleController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { loginWithGoogleOAuthSchema } from '../validation/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { userSchema, loginSchema, emailSchema, resetPasswordSchema } from '../utils/schemas.js';

const router = express.Router();

router.post('/send-reset-email', validateBody(emailSchema), sendResetEmail);
router.post('/reset-pwd', validateBody(resetPasswordSchema), resetPassword);

router.post('/register', validateBody(userSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/refresh', refreshSession);
router.post('/logout', logout);
router.get('/get-oauth-url', ctrlWrapper(getGoogleOAuthUrlController));
router.post(
  '/confirm-oauth',
  validateBody(loginWithGoogleOAuthSchema),
  ctrlWrapper(loginWithGoogleController),
);

export default router;