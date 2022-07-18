const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const bcrypt = require("bcrypt");

const handleLogin = async (request, response) => {
  const { username, password } = request.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const isUserInDatabase = usersDB.users.find(
    (user) => user.username === username
  );

  if (!isUserInDatabase) return response.sendStatus(401); //Unauthorized
};
