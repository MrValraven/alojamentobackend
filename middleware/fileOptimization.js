const fs = require("fs");
const tinify = require("tinify");
tinify.key = process.env.TINIFY_API_KEY;

const optimizeFiles = async (files) => {
  const filesArray = Object.keys(files).map((key) => {
    return files[key];
  });

  const optimizedFiles = [];

  for (let i = 0; i < filesArray.length; i++) {
    console.log("going in loop at: ", i);
    tinify.fromBuffer(filesArray[i].data).toBuffer((error, resultData) => {
      if (error) {
        console.log(error);
        return;
      }
      let fileName = `foto${i}.jpg`;

      fs.writeFile(fileName, resultData, "binary", function (error) {
        if (error) {
          console.log("ocorreu um erro: ", error);
        } else console.log("ficheiro criado");
      });
      optimizedFiles.push(resultData);
    });
  }

  return optimizedFiles;
};

module.exports = optimizeFiles;
