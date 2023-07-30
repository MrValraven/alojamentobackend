const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
  origin: (origin, callback) => {
    const isOriginInAllowedOrigins = allowedOrigins.includes(origin);
    if (isOriginInAllowedOrigins) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
