const express = require("express");
const router = express.Router();
const resetPasswordController = require("../controllers/resetPasswordController");
const verifyJWT = require("../middleware/verifyJWT");

router.post("/", verifyJWT, resetPasswordController.resetPassword);

module.exports = router;
