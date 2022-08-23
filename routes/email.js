const express = require("express");
const router = express.Router();
const emailController = require("../util/email");

router.get("/", emailController.sendEmail);

module.exports = router;
