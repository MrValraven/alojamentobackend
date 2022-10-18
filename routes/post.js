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

router.get("/", postController.getAllPosts);

router.get("/:postSlug", postController.getPostById);

router.delete("/:postSlug", postController.deletePostBySlug);

router.put("/:postSlug", postController.editPost);

router.get("/allposts/:owner_id", postController.getPostsByOwnerId);

module.exports = router;
