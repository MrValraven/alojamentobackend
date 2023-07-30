const path = require('path');

const fileExtensionLimiter = (request, response, next) => {
  const allowedFileExtensions = ['.png', '.jpg', '.jpeg', '.webp'];
  const files = request.files.file;

  const fileExtensions = [];

  files.forEach((file) => {
    fileExtensions.push(path.extname(file.name));
  });

  const isAllFileExtensionsAllowed = fileExtensions.every((extension) => allowedFileExtensions.includes(extension));

  if (!isAllFileExtensionsAllowed) {
    const message = `Upload failed. Only ${allowedFileExtensions.toString()} files allowed`;

    response.status(422).json({ status: 'error', message });
  }

  next();
};

module.exports = fileExtensionLimiter;
