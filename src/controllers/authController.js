/* eslint-disable max-len */
/* eslint-disable no-unused-expressions */
/* eslint-disable operator-linebreak */
/* eslint-disable consistent-return */
/* eslint-disable object-curly-newline */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const { sendEmail } = require('../utils/email');

async function getUserByField(field, fieldValue, response) {
  const user = await User.findOne({ [field]: fieldValue }).exec();

  if (!user) {
    field === 'refreshToken'
      ? response.sendStatus(403).json({ message: 'Invalid refresh token' })
      : response.status(401).json({ message: "User doesn't exist" });
  }

  return user;
}

async function addJwtAuthToUser(user) {
  const ACCESS_TOKEN_EXPIRY_TIME = { expiresIn: '10s' };
  const REFRESH_TOKEN_EXPIRY_TIME = { expiresIn: '1d' };

  const accessToken = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY_TIME);

  const refreshToken = jwt.sign({ email: user.email }, process.env.REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY_TIME);

  // update user in database with refresh token
  user.refreshToken = refreshToken;

  await user.save();

  return { accessToken, refreshToken };
}

const handleLogin = async (request, response) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return response.status(400).json({ message: 'Email and password are required' });
  }

  const user = await getUserByField('email', email);

  if (!user.isVerified) {
    return response.status(401).json({ message: "Account isn't verified" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    response.status(401).json({ message: 'Wrong password' });
  }

  const { accessToken, refreshToken } = await addJwtAuthToUser(user);
  const { username, name, phoneNumber, posts } = user;
  const roles = Object.values(user.roles).filter(Boolean);
  const ONE_DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

  response.cookie('jwt', refreshToken, {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
    maxAge: ONE_DAY_IN_MILLISECONDS,
  });
  response.status(200).json({
    message: 'Login successful',
    username,
    email,
    name,
    phoneNumber,
    accessToken,
    roles,
    posts,
  });
};

const handleLogout = async (request, response) => {
  const { cookies } = request;

  if (!cookies?.jwt) {
    return response.sendStatus(204);
  }

  const refreshToken = cookies.jwt;

  const user = await getUserByField('refreshToken', refreshToken);

  if (!user) {
    response.clearCookie('jwt', { httpOnly: true });
    return response.sendStatus(204); // No content
  }

  // Delete refresh token in database

  user.refreshToken = '';
  await user.save();

  response.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
  });
  response.sendStatus(204);
};

const resetPassword = async (request, response) => {
  const { id, password } = request.body;

  if (!id) {
    response.status(400).json({ message: 'Id is required' });
  }

  const user = await getUserByField('_id', id);

  if (!user) {
    return response.status(401).json({ message: "User doesn't exist" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user.password = hashedPassword;
  await user.save();

  response.status(201).json({ message: 'Password has been updated' });
};

const handleForgottenPassword = async (request, response) => {
  const { email } = request.body;

  if (!email) {
    return response.status(400).json({ message: 'Email is required' });
  }

  const user = await getUserByField('email', email);

  // Create a one time link valid for 15 minutes

  const secret = process.env.ACCESS_TOKEN_SECRET;

  const payload = {
    id: user.id,
  };

  const token = jwt.sign(payload, secret, { expiresIn: '15m' });

  const link = `https://${process.env.DOMAIN_URL}/reset_palavra_passe/${token}`;

  const messageInPlainText =
    'Foi feito um pedido para repor a sua palavra passe. Por favor clique no link abaixo para efetuar a mudança.';

  const messageInHTML = `<h1>Foi feito um pedido para repor a sua palavra passe.</h1><p>Por favor clique no link abaixo para efetuar a mudança</p><a href='${link}'>${link}</a>`;

  // Enviar email com o link
  sendEmail(user.email, 'Repor a sua palavra passe | Portal do Alojamento', messageInPlainText, messageInHTML);

  response.status(201).json({ message: "Password reset link has been sent to user's email." });
};

const handleRefreshToken = async (request, response) => {
  const { cookies } = request;

  if (!cookies?.jwt) {
    return response.sendStatus(401);
  }

  const refreshToken = cookies.jwt;
  const user = await getUserByField('refreshToken', refreshToken);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, decoded) => {
    if (error || user.email !== decoded.email) {
      return response.sendStatus(403);
    }

    const roles = Object.values(user.roles);

    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: user.username,
          email: decoded.email,
          roles,
          name: user.name,
          phoneNumber: user.phoneNumber,
          posts: user.posts,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '10s' },
    );

    response.json({ accessToken, roles });
  });
};

const verifyAccount = async (request, response) => {
  const { id } = request.body;

  if (!id) {
    return response.status(400).json({ message: 'id is required' });
  }

  const user = await getUserByField('_id', id);

  if (user.isVerified) {
    return response.status(409).json({ message: 'This account is already verified' });
  }

  user.isVerified = true;
  await user.save();
  return response.status(200).json({ message: 'Account successfully verified' });
};

module.exports = {
  handleLogin,
  handleLogout,
  resetPassword,
  handleForgottenPassword,
  handleRefreshToken,
  verifyAccount,
};
