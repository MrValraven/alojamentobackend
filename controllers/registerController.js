const bcrypt = require("bcrypt");

const User = require("../model/User");

const handleNewUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  //Check for duplicate usernames in Database

  const duplicateUser = await User.findOne({ username: username }).exec();

  if (duplicateUser) return res.sendStatus(409); // Conflict

  try {
    //Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create and store the new user
    const newUser = await User.create({
      username: username,
      password: hashedPassword,
    });

    console.log(newUser);

    res.status(201).json({ message: `New user ${username} created!` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { handleNewUser };
