const express = require("express");
const router = express.Router();
const imagesController = require("../controllers/imagesController");

router.get("/:folder/:imageName", imagesController.getImage);

module.exports = router;
