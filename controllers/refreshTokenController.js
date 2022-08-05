const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const jwt = require("jsonwebtoken");

const handleRefreshToken = (request, response) => {
  const cookies = request.cookies;

  if (!cookies?.jwt) {
    return res.sendStatus(401);
  }

  console.log(cookies.jwt);

  const refreshToken = cookies.jwt;

  const userFoundInDatabase = usersDB.users.find(
    (user) => user.refreshToken === refreshToken
  );

  if (!userFoundInDatabase) return response.sendStatus(403); // Forbidden

  //evaluate jwt

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (error, decoded) => {
      if (error || userFoundInDatabase.username !== decoded.username)
        return response.sendStatus(403);

      const acessToken = jwt.sign(
        { username: decoded.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30s" }
      );

      response.json({ acessToken });
    }
  );
};

module.exports = { handleRefreshToken };
