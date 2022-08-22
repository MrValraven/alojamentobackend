const User = require("../model/User");

const verifyAccount = async (request, response) => {
  const { accountID } = request.body;

  if (!accountID) {
    return response.status(400).json({ message: "accountID is required" });
  }

  const userFoundInDatabase = await User.findOne({ _id: accountID }).exec();

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

  const userFoundInDatabase = await User.findOne({ email: email }).exec();

  response.status(200).json({ message: "sucess", id: userFoundInDatabase._id });
};

module.exports = { verifyAccount, sendAccountId };
