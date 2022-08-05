const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fsPromises = require("fs").promises;
const path = require("path");

const handleLogin = async (request, response) => {
  const { username, password } = request.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const userFoundInDatabase = usersDB.users.find(
    (user) => user.username === username
  );

  if (!userFoundInDatabase) return response.sendStatus(401); //Unauthorized

  //evaluate password

  const match = await bcrypt.compare(password, userFoundInDatabase.password);

  if (match) {
    // create JWTs
    const acessToken = jwt.sign(
      { username: userFoundInDatabase.username },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "900s",
      }
    );

    const refreshToken = jwt.sign(
      { username: userFoundInDatabase.username },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Saving refreshToken with current user
    const otherUsers = usersDB.users.filter(
      (user) => user.username !== userFoundInDatabase.username
    );
    const currentUser = { ...userFoundInDatabase, refreshToken };
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );
    const ONE_DAY_IN_MILISECONDS = 24 * 60 * 60 * 1000;
    response.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: ONE_DAY_IN_MILISECONDS,
    });
    response.json({ acessToken });
  } else {
    response.sendStatus(401);
  }
};

module.exports = { handleLogin };
