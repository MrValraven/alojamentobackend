const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const fsPromises = require("fs").promises;
const path = require("path");

const handleLogout = async (request, response) => {
  const cookies = request.cookies;

  if (!cookies?.jwt) {
    return res.sendStatus(204);
  }

  const refreshToken = cookies.jwt;

  const userFoundInDatabase = usersDB.users.find(
    (user) => user.refreshToken === refreshToken
  );

  if (!userFoundInDatabase) {
    response.clearCookie("jwt", { httpOnly: true });
    return response.sendStatus(204); // No content
  }

  // Delete refresh token in database
  const otherUsers = usersDB.users.filter(
    (user) => user.refreshToken !== userFoundInDatabase.refreshToken
  );

  const currentUser = { ...userFoundInDatabase, refreshToken: "" };
  usersDB.setUsers([...otherUsers, currentUser]);
  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "users.json"),
    JSON.stringify(usersDB.users)
  );

  response.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  response.sendStatus(204);
};

module.exports = { handleLogout };
