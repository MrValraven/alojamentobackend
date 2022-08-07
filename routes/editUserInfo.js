const express = require("express");
const router = express.Router();
const editUserInfoController = require("../controllers/editUserInfoController");

router.post("/", editUserInfoController.editUserInfo);

module.exports = router;
