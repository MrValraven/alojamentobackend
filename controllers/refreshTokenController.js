const User = require("../model/User");

const jwt = require("jsonwebtoken");

const handleRefreshToken = async (request, response) => {
  const cookies = request.cookies;

  if (!cookies?.jwt) {
    return response.sendStatus(401);
  }

  const refreshToken = cookies.jwt;

  const userFoundInDatabase = await User.findOne({
    refreshToken: refreshToken,
  }).exec();

  if (!userFoundInDatabase) return response.sendStatus(403); // Forbidden

  //evaluate jwt

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (error, decoded) => {
      if (error || userFoundInDatabase.email !== decoded.email) {
        return response.sendStatus(403);
      }

      const roles = Object.values(userFoundInDatabase.roles);

      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: userFoundInDatabase.username,
            email: decoded.email,
            roles: roles,
            phoneNumber: userFoundInDatabase.phoneNumber,
            posts: userFoundInDatabase.posts,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10s" }
      );

      response.json({ accessToken, roles });
    }
  );
};

module.exports = { handleRefreshToken };
