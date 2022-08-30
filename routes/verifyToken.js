const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");

router.post("/", verifyJWT, (request, response) => {
  response.status(200).json({ message: "Token verified" });
});

module.exports = router;
