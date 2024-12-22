import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { createNewSession, generateTokens } from '../services/auth.js';
import { sendEmail } from '../services/email.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

export const sendResetEmail = ctrlWrapper(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw createError(404, 'User not found!');
  }

  const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5m' });
  const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${resetToken}`;
  const emailContent = `
    <h1>Reset your password</h1>
    <p>Click the link below to reset your password:</p>
    <a href="${resetLink}">${resetLink}</a>
  `;

  await sendEmail(email, 'Reset Password', emailContent);

  res.status(200).json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
  });
});

export const resetPassword = ctrlWrapper(async (req, res) => {
  const { token, password } = req.body;
  const { email } = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findOne({ email });
  if (!user) {
    throw createError(404, 'User not found!');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  await user.save();

  await Session.deleteMany({ userId: user._id });

  res.status(200).json({ message: 'Password has been successfully reset.' });
});

export const register = ctrlWrapper(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword });
  await newUser.save();

  res.status(201).json({ name: newUser.name, email: newUser.email });
});

export const login = ctrlWrapper(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw createError(401, 'Invalid email or password');
  }

  const session = await createNewSession(user);
  res.status(200).json({ accessToken: session.accessToken, refreshToken: session.refreshToken });
});

export const refreshSession = ctrlWrapper(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    throw createError(400, 'Refresh token is required');
  }

  const tokens = await generateTokens(refreshToken);
  res.status(200).json(tokens);
});

export const logout = ctrlWrapper(async (req, res) => {
  const session = await Session.findOneAndDelete({ refreshToken: req.cookies.refreshToken });
  if (!session) {
    throw createError(404, 'Session not found');
  }

  res.status(204).send();
});
