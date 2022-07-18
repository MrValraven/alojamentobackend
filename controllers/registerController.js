const path = require("path");
const fsPromises = require("fs").promises;
const bcrypt = require("bcrypt");

const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const handleNewUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  //Check for duplicate usernames in Database

  const duplicateUser = usersDB.users.find(
    (person) => person.username === username
  );

  if (duplicateUser) return res.sendStatus(409);

  try {
    //Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Store the new user
    const newUser = {
      username: username,
      password: hashedPassword,
    };

    usersDB.setUsers([...usersDB.users, newUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );
    console.log(usersDB.users);
    res.status(201).json({ message: `New user ${username} created!` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { handleNewUser };
