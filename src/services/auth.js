import jwt from 'jsonwebtoken';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';
import createHttpError from 'http-errors';

export const generateTokens = async (refreshToken) => {
  const session = await Session.findOne({ refreshToken });

  if (!session) {
    throw createHttpError(401, 'Invalid refresh token');
  }

  const accessToken = jwt.sign({ userId: session.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId: session.userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });

  await Session.findByIdAndUpdate(session._id, { accessToken, refreshToken });

  return { accessToken, refreshToken };
};