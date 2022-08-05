const jwt = require("jsonwebtoken");

const verifyJWT = (request, response, next) => {
  const authHeader = request.headers["authorization"];

  if (!authHeader) return response.sendStatus(401);

  console.log(authHeader);

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error) return response.sendStatus(403);

    request.username = decoded.username;
    next();
  });
};

module.exports = verifyJWT;
