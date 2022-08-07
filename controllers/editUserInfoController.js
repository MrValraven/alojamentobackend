const User = require("../model/User");

const editUserInfo = async (request, response) => {
  const { email, editParameter, parameterValue } = request.body;

  if (!email || !editParameter || !parameterValue) {
    return response
      .status(400)
      .json({ message: "Email and parameters are required" });
  }

  const isParameterValueAlreadyInUse = await User.findOne({
    [editParameter]: parameterValue,
  }).exec();

  if (isParameterValueAlreadyInUse) {
    return response
      .status(409)
      .json({ message: "Parameter is already in use" });
  }

  const userFoundInDatabase = await User.findOne({
    email: email,
  }).exec();

  userFoundInDatabase[editParameter] = parameterValue;
  const result = await userFoundInDatabase.save();

  console.log(result);

  response.status(201).json({ message: "User info edited successfully" });
};

module.exports = { editUserInfo };
