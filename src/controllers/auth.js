import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { createNewSession } from '../services/auth.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ name, email, password: hashedPassword });
  await newUser.save();

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: { name: newUser.name, email: newUser.email },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw createError(401, 'Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createError(401, 'Invalid email or password');
  }

  const session = await createNewSession(user);

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in a user!',
    data: { accessToken: session.accessToken },
  });
};

export const refreshSession = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw createError(401, 'No refresh token found');
  }

  const session = await Session.findOne({ refreshToken });
  if (!session) {
    throw createError(401, 'Invalid refresh token');
  }

  const newSession = await createNewSession(session.userId);
  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken: newSession.accessToken },
  });
};

export const logout = async (req, res) => {
  const session = await Session.findOneAndDelete({ refreshToken: req.cookies.refreshToken });
  if (!session) {
    throw createError(404, 'Session not found');
  }

  res.status(204).send();
};
