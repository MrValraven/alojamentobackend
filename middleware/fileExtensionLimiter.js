const path = require("path");

const fileExtensionLimiter = (allowedExtensionsArray) => {
  return (request, response, next) => {
    const files = request.files;

    const fileExtensions = [];

    Object.keys(files).forEach((key) => {
      fileExtensions.push(path.extname(files[key].name));
    });

    // Are the file extensions allowed?
    const allowed = fileExtensions.every((extension) =>
      allowedExtensionsArray.includes(extension)
    );

    if (!allowed) {
      const message = `Upload failed. Only ${allowedExtensionsArray.toString()} files allowed`;

      response.status(422).json({ status: "error", message: message });
    }

    next();
  };
};

module.exports = fileExtensionLimiter;
