const bcrypt = require("bcrypt");
const User = require("../model/User");
const sendEmail = require("../util/email").sendEmail;

const resetPassword = async (request, response) => {
  const { id, password } = request.body;

  if (!id) {
    response.status(400).json({ message: "Id is required" });
  }

  const userFoundInDatabase = await User.findOne({ _id: id }).exec();

  if (!userFoundInDatabase) {
    return response.status(401).json({ message: "User doesn't exist" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  userFoundInDatabase.password = hashedPassword;
  const result = await userFoundInDatabase.save();

  response.status(201).json({ message: "Password has been updated" });
};

module.exports = { resetPassword };
