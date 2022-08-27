const Post = require("../model/Post");
const optimizeAndUploadFiles = require("../middleware/fileOptimization");

const createPost = async (request, response) => {
  const files = request.files;

  const folderName = "anuncio1";

  await optimizeAndUploadFiles(files, folderName);

  response.json({ message: "tihi" });
};

module.exports = { createPost };
