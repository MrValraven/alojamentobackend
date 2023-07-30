const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const tinify = require('tinify');
tinify.key = process.env.TINIFY_API_KEY;

const optimizeAndUploadFiles = async (files, folderName) => {
  const filesArray = Object.keys(files).map((key) => files[key]);

  const optimizedFiles = [];

  try {
    const doesPostsFolderAlreadyExist = fs.existsSync(path.join(__dirname, '..', 'posts'));
    if (!doesPostsFolderAlreadyExist) {
      await fsPromises.mkdir(path.join(__dirname, '..', 'posts'));
    }

    const doesFolderNameAlreadyExist = fs.existsSync(path.join(__dirname, '..', 'posts', folderName));
    if (!doesFolderNameAlreadyExist) {
      await fsPromises.mkdir(path.join(__dirname, '..', 'posts', folderName));
    }
  } catch (error) {
    console.log(error);
  }

  for (let i = 0; i < filesArray.length; i++) {
    tinify.fromBuffer(filesArray[i].data).toBuffer(async (error, resultData) => {
      if (error) {
        console.log(error);
        return;
      }
      const fileName = `foto${i}.jpg`;
      try {
        const PATH_TO_WRITE_FILES = path.join(__dirname, '..', 'posts', folderName, fileName);
        await fsPromises
          .writeFile(PATH_TO_WRITE_FILES, resultData, 'binary', function (error) {
            if (error) {
              console.log('ocorreu um erro: ', error);
            }
          })
          .then(() => {
            console.log('ficheiro criado: ' + `${folderName}/${fileName}`);
          });
      } catch (error) {
        console.log('erro', error);
      }
    });
  }
};

module.exports = optimizeAndUploadFiles;
