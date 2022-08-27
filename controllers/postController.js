const Post = require("../model/Post");
const path = require("path");
const optimizeFiles = require("../middleware/fileOptimization");

const createPost = async (request, response) => {
  const files = request.files;

  await optimizeFiles(files);

  response.json({ message: "tihi" });
};

module.exports = { createPost };
