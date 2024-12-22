import jwt from 'jsonwebtoken';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';
import createHttpError from 'http-errors';
import { getFullNameFromGoogleTokenPayload, validateCode } from '../utils/googleOAuth2.js';


export const loginOrSignupWithGoogle = async (code) => {
  const loginTicket = await validateCode(code);
  const payload = loginTicket.getPayload();
  if (!payload) throw createHttpError(401);

  let user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    const password = await bcrypt.hash(randomBytes(10), 10);
    user = await UsersCollection.create({
      email: payload.email,
      name: getFullNameFromGoogleTokenPayload(payload),
      password,
      role: 'parent',
    });
  }

  const newSession = createSession();

  return await SessionsCollection.create({
    userId: user._id,
    ...newSession,
  });
};


export const generateTokens = async (refreshToken) => {
  const session = await Session.findOne({ refreshToken });

  if (!session) {
    throw createHttpError(401, 'Invalid refresh token');
  }

  const accessToken = jwt.sign({ userId: session.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  const newRefreshToken = jwt.sign({ userId: session.userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });

  await Session.findByIdAndUpdate(session._id, { accessToken, refreshToken: newRefreshToken });

  return { accessToken, refreshToken: newRefreshToken };
};

export const createNewSession = async (user) => {
  const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });

  const newSession = new Session({ userId: user._id, accessToken, refreshToken });
  await newSession.save();

  return { accessToken, refreshToken };
};
