const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const fileUpload = require("express-fileupload");
const fileExtensionLimiter = require("../middleware/fileExtensionLimiter");
const fileSizeLimiter = require("../middleware/fileSizeLimiter");
const filesPayloadExists = require("../middleware/filesPayloadExists");

router.post(
  "/",
  fileUpload({ createParentPath: true }),
  filesPayloadExists,
  fileExtensionLimiter([".png", ".jpg", ".jpeg", ".webp"]),
  fileSizeLimiter,
  postController.createPost
);

module.exports = router;
