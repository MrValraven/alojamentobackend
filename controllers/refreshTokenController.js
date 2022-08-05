const User = require("../model/User");

const jwt = require("jsonwebtoken");

const handleRefreshToken = async (request, response) => {
  const cookies = request.cookies;

  if (!cookies?.jwt) {
    return res.sendStatus(401);
  }

  console.log(cookies.jwt);

  const refreshToken = cookies.jwt;

  const userFoundInDatabase = await User.findOne({ email: email }).exec();

  if (!userFoundInDatabase) return response.sendStatus(403); // Forbidden

  //evaluate jwt

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (error, decoded) => {
      if (error || userFoundInDatabase.email !== decoded.email)
        return response.sendStatus(403);

      const acessToken = jwt.sign(
        { email: decoded.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30s" }
      );

      response.json({ acessToken });
    }
  );
};

module.exports = { handleRefreshToken };
