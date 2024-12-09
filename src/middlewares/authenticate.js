import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { ACCESS_TOKEN_SECRET } from '../config.js';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(createError(401, 'Authorization header missing or invalid'));
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return next(createError(401, 'Access token expired'));
    }
    req.user = decoded;
    next();
  });
};
