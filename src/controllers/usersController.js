/* eslint-disable consistent-return */
/* eslint-disable operator-linebreak */
const bcrypt = require('bcrypt');
const User = require('../model/User');
const { sendEmail } = require('../utils/email');

const getAllUsers = async (request, response) => {
  let usersInDatabase = await User.find({});

  if (!usersInDatabase) {
    return response.status(400).json({ message: 'No users available' });
  }
  usersInDatabase = usersInDatabase.map((user) => ({
    email: user.email,
    roles: user.roles,
  }));

  response.json(usersInDatabase);
};

const createNewUser = async (request, response) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return response.status(400).json({ message: 'Username and password are required' });
  }

  // Check if email is already in used in Database

  const isUserInDatabase = await User.findOne({ email }).exec();

  if (isUserInDatabase) return response.status(409).json({ message: 'Email is already in use by another user' }); // Conflict

  try {
    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and store the new user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      username: '',
      name: '',
      phoneNumber: '',
      posts: [],
      isVerified: false,
    });

    // Send email to verify account
    console.log(`Account created with email: ${email}`);

    // eslint-disable-next-line no-underscore-dangle
    const userId = newUser._id;

    const urlToVerifyAccount = `https://alojamentoasap.vercel.app/verificar_conta/${userId.toString()}`;

    const messageInPlainText =
      'A sua conta foi criada com sucesso! Por favor clique no link abaixo para verificar a sua conta';

    const messageInHTML =
      '<h1>A sua conta foi criada com sucesso!</h1><p> Por favor clique no link abaixo para validar a sua conta</p>' +
      `<a href='${urlToVerifyAccount}'>${urlToVerifyAccount}</a>`;

    sendEmail(newUser.email, 'A sua conta foi criada com sucesso', messageInPlainText, messageInHTML);

    response.status(201).json({ message: `New account with email: ${email} created!` });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

const editUserInfo = async (request, response) => {
  const { email, editParameter, parameterValue } = request.body;

  if (!email || !editParameter || !parameterValue) {
    return response.status(400).json({ message: 'Email and parameters are required' });
  }

  if (editParameter === 'email' || editParameter === 'username') {
    const isParameterValueAlreadyInUse = await User.findOne({
      [editParameter]: parameterValue,
    }).exec();

    if (isParameterValueAlreadyInUse) {
      return response.status(409).json({ message: 'Parameter is already in use' });
    }
  }

  const userFoundInDatabase = await User.findOne({
    email,
  }).exec();

  userFoundInDatabase[editParameter] = parameterValue;
  await userFoundInDatabase.save();

  response.status(201).json({ message: 'User info edited successfully' });
};

module.exports = { getAllUsers, createNewUser, editUserInfo };
