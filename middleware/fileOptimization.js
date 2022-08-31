const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
const tinify = require("tinify");
tinify.key = process.env.TINIFY_API_KEY;

const optimizeAndUploadFiles = async (files, folderName) => {
  const filesArray = Object.keys(files).map((key) => {
    return files[key];
  });

  const optimizedFiles = [];

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "posts"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "posts"));
    }
    if (!fs.existsSync(path.join(__dirname, "..", "posts", folderName))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "posts", folderName));
    }
  } catch (error) {
    console.log(error);
  }

  for (let i = 0; i < filesArray.length; i++) {
    tinify
      .fromBuffer(filesArray[i].data)
      .toBuffer(async (error, resultData) => {
        if (error) {
          console.log(error);
          return;
        }
        let fileName = `foto${i}.jpg`;
        try {
          await fsPromises
            .writeFile(
              path.join(__dirname, "..", "posts", folderName, fileName),
              resultData,
              "binary",
              function (error) {
                if (error) {
                  console.log("ocorreu um erro: ", error);
                }
              }
            )
            .then(() => {
              console.log("ficheiro criado: " + `${folderName}/${fileName}`);
            });
        } catch (error) {
          console.log("erro", error);
        }
      });
  }
};

module.exports = optimizeAndUploadFiles;
