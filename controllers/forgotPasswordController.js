const User = require("../model/User");
const jwt = require("jsonwebtoken");

const sendEmail = require("../util/email").sendEmail;

const handleForgottenPassword = async (request, response) => {
  const { email } = request.body;

  if (!email) {
    return response.status(400).json({ message: "Email is required" });
  }

  const userFoundInDatabase = await User.findOne({ email: email }).exec();

  if (!userFoundInDatabase) {
    return response.status(401).json({ message: "User doesn't exist" });
  }

  // Create a one time link valid for 15 minutes

  const secret = process.env.ACCESS_TOKEN_SECRET + userFoundInDatabase.password;

  const payload = {
    email: userFoundInDatabase.email,
    id: userFoundInDatabase.id,
  };

  const token = jwt.sign(payload, secret, { expiresIn: "15m" });

  const link = `https://alojamentoasap.vercel.app/reset_palavra_passe/${userFoundInDatabase.id}/${token}`;

  const messageInPlainText =
    "Foi feito um pedido para repor a sua palavra passe. Por favor clique no link abaixo para efetuar a mudança.";

  const messageInHTML = `<h1>Foi feito um pedido para repor a sua palavra passe.</h1><p>Por favor clique no link abaixo para efetuar a mudança</p><a href='${link}'>${link}</a>`;

  //mandar email com o link
  sendEmail(
    userFoundInDatabase.email,
    "Repor a sua palavra passe | Portal do Alojamento",
    messageInPlainText,
    messageInHTML
  );

  response
    .status(201)
    .json({ message: "Password reset link has been sent to user's email." });
};

module.exports = { handleForgottenPassword };
