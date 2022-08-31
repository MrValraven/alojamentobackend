const filesPayloadExists = (request, response, next) => {
  if (!request.body.photos) {
    return response
      .status(400)
      .json({ status: "error", message: "Missing files" });
  }

  next();
};

module.exports = filesPayloadExists;
