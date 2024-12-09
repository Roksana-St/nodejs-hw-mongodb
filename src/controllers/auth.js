import {
  registerService,
  loginService,
  refreshService,
  logoutService,
} from '../services/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

export const register = ctrlWrapper(async (req, res) => {
  const newUser = await registerService(req.body);
  res.status(201).json({ message: 'User registered successfully', user: newUser });
});

export const login = ctrlWrapper(async (req, res) => {
  const { email, password } = req.body;
  const tokens = await loginService(email, password);
  res.status(200).json({ message: 'Login successful', tokens });
});

export const refresh = ctrlWrapper(async (req, res) => {
  const { refreshToken } = req.body;
  const tokens = await refreshService(refreshToken);
  res.status(200).json({ message: 'Tokens refreshed successfully', tokens });
});

export const logout = ctrlWrapper(async (req, res) => {
  const { sessionId, refreshToken } = req.body;
  await logoutService(sessionId, refreshToken);
  res.status(204).send();
});
