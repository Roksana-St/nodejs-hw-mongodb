import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { Session } from '../models/session.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(createError(401, 'Unauthorized'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const activeSession = await Session.findOne({ userId: payload.userId, accessToken: token });
    if (!activeSession) {
      return next(createError(401, 'Session expired or invalid token'));
    }

    req.user = payload;
    next();
  } catch (error) {
    next(createError(401, 'Unauthorized'));
  }
};
