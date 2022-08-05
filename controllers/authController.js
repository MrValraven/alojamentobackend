const User = require("../model/User");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (request, response) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return response
      .status(400)
      .json({ message: "Email and password are required" });
  }

  const userFoundInDatabase = await User.findOne({ email: email }).exec();

  if (!userFoundInDatabase) {
    return response.status(401).json({ message: "User doesn't exist" });
  }

  //evaluate password

  const isPasswordCorrect = await bcrypt.compare(
    password,
    userFoundInDatabase.password
  );

  if (isPasswordCorrect) {
    // create JWTs
    const acessToken = jwt.sign(
      { email: userFoundInDatabase.email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "900s",
      }
    );

    const refreshToken = jwt.sign(
      { email: userFoundInDatabase.email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // update user in database with refresh token
    userFoundInDatabase.refreshToken = refreshToken;

    const result = await userFoundInDatabase.save();
    console.log(result);

    const ONE_DAY_IN_MILISECONDS = 24 * 60 * 60 * 1000;
    response.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: ONE_DAY_IN_MILISECONDS,
    });
    response.status(200).json({ message: "Login sucessfull" });
  } else {
    response.status(401).json({ message: "Wrong password" });
  }
};

module.exports = { handleLogin };