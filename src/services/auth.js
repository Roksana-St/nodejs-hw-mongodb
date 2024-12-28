import jwt from 'jsonwebtoken';
import { Session } from '../models/session.js';
import createError from 'http-errors';

export const createNewSession = async (user) => {
  const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });

  const session = new Session({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 
  });

  await session.save();
  return { accessToken, refreshToken };
};

export const generateTokens = async (refreshToken) => {
  const session = await Session.findOne({ refreshToken });

  if (!session || new Date() > session.refreshTokenValidUntil) {
    throw createError(401, 'Invalid or expired refresh token');
  }

  const accessToken = jwt.sign({ userId: session.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  const newRefreshToken = jwt.sign({ userId: session.userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });

  await Session.findByIdAndUpdate(session._id, {
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken: newRefreshToken };
};
