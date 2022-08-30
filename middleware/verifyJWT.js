const jwt = require("jsonwebtoken");

const verifyJWT = (request, response, next) => {
  console.log("verifying");
  const authHeader = request.headers["authorization"];

  if (!authHeader)
    return response.status(401).json({ message: "Token not authorized" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error)
      return response.status(403).json({ message: "Token has expired" });

    request.username = decoded.username;
    console.log("token sucessfully verified");
    next();
  });
};

module.exports = verifyJWT;
