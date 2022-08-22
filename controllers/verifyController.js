const User = require("../model/User");

const verifyAccount = async (request, response) => {
  const { id } = request.body;

  if (!id) {
    return response.status(400).json({ message: "id is required" });
  }

  const userFoundInDatabase = await User.findOne({ _id: id }).exec();

  if (!userFoundInDatabase) {
    return response.status(401).json({ message: "User doesn't exist" });
  }

  if (userFoundInDatabase.isVerified) {
    return response
      .status(409)
      .json({ message: "This account is already verified" });
  } else {
    userFoundInDatabase.isVerified = true;
    const result = await userFoundInDatabase.save();
    return response
      .status(200)
      .json({ message: "Account successfully verified" });
  }
};

const sendAccountId = async (request, response) => {
  const { email } = request.body;

  console.log("email: ", email);

  const userFoundInDatabase = await User.findOne({ email: email }).exec();

  console.log(userFoundInDatabase);

  /* if (userFoundInDatabase !== undefined) {
    response
      .status(200)
      .json({ message: "sucess", id: userFoundInDatabase.id.toString() });
  } else {
    console.log(userFoundInDatabase);
  } */
};

module.exports = { verifyAccount, sendAccountId };
