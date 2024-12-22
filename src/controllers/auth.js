import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { createNewSession, generateTokens } from '../services/auth.js';
import { sendEmail } from '../services/email.js';
import { generateAuthUrl } from '../utils/googleOAuth2.js';
import { loginOrSignupWithGoogle } from '../services/auth.js';


export const loginWithGoogleController = async (req, res) => {
  const session = await loginOrSignupWithGoogle(req.body.code);
  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in via Google OAuth!',
    data: {
      accessToken: session.accessToken,
    },
  });
};



export const getGoogleOAuthUrlController = async (req, res) => {
  const url = generateAuthUrl();
  res.json({
    status: 200,
    message: 'Successfully get Google OAuth url!',
    data: {
      url,
    },
  });
};


export const sendResetEmail = async (req, res) => {
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

  try {
    await sendEmail(email, 'Reset Password', emailContent);
    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    throw createError(500, 'Failed to send the email, please try again later.');
  }
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email });

    if (!user) {
      throw createError(404, 'User not found!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    await Session.deleteMany({ userId: user._id });

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (error) {
    throw createError(401, 'Token is expired or invalid.');
  }
};



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

export const refreshSession = async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw createHttpError(400, 'Refresh token is required');
  }

  try {
    const newTokens = await generateTokens(refreshToken);
    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: {
        accessToken: newTokens.accessToken,
      },
    });
  } catch (error) {
    next(error);  
  }
};

export const logout = async (req, res) => {
  const session = await Session.findOneAndDelete({ refreshToken: req.cookies.refreshToken });
  if (!session) {
    throw createError(404, 'Session not found');
  }

  res.status(204).send();
};
