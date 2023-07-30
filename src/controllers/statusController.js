const getStatus = (request, response) => {
  response.status(200).json({ message: 'Server is online' });
};

module.exports = { getStatus };
