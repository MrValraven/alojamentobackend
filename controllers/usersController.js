const User = require("../model/User");

const getAllUsers = async (request, response) => {
  let usersInDatabase = await User.find({});

  if (!usersInDatabase) {
    return res.status(400).json({ message: "No users available" });
  }
  usersInDatabase = usersInDatabase.map((user) => ({
    email: user.email,
    roles: user.roles,
  }));

  response.json(usersInDatabase);
};

module.exports = { getAllUsers };
