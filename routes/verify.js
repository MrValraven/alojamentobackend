const express = require("express");
const router = express.Router();
const verifyController = require("../controllers/verifyController");

router.post("/", verifyController.verifyAccount);
router.get("/", verifyController.sendAccountId);

module.exports = router;
