const User = require("../model/User");

const handleLogout = async (request, response) => {
  const cookies = request.cookies;

  if (!cookies?.jwt) {
    return res.sendStatus(204);
  }

  const refreshToken = cookies.jwt;

  const userFoundInDatabase = await User.findOne({
    refreshToken: refreshToken,
  }).exec();

  if (!userFoundInDatabase) {
    response.clearCookie("jwt", { httpOnly: true });
    return response.sendStatus(204); // No content
  }

  // Delete refresh token in database

  userFoundInDatabase.refreshToken = "";
  const result = await userFoundInDatabase.save();

  response.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  response.sendStatus(204);
};

module.exports = { handleLogout };
