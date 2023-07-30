const { logEvents } = require('./logEvents');

const errorHandler = (error, request, response) => {
  logEvents(`FROM:${request.headers.origin} | ${error.name}: ${error.message}`, 'errorLogs.txt');
  console.log(error.stack);
  response.status(500).send(error.message);
};

module.exports = { errorHandler };
