const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const fileUpload = require("express-fileupload");

router.post(
  "/",
  fileUpload({ createParentPath: true }),
  postController.createPost
);

module.exports = router;
