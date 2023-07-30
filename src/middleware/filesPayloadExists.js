/* eslint-disable consistent-return */
const filesPayloadExists = (request, response, next) => {
  if (!request.files) {
    return response.status(400).json({ status: 'error', message: 'Missing files' });
  }

  next();
};

module.exports = filesPayloadExists;
