const bcrypt = require("bcrypt");

const User = require("../model/User");

const handleNewUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  //Check if email is already in used in Database

  const duplicateUser = await User.findOne({ email: email }).exec();

  if (duplicateUser)
    return res
      .status(409)
      .json({ message: "Email is already in use by another user" }); // Conflict

  try {
    //Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create and store the new user
    const newUser = await User.create({
      email: email,
      password: hashedPassword,
      username: "",
      name: "",
      phoneNumber: "",
      posts: [],
    });

    console.log(newUser);

    res
      .status(201)
      .json({ message: `New account with email: ${email} created!` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { handleNewUser };
