require('dotenv').config();
const path = require('path');
const https = require('https');
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const pem = require('pem');

const app = express();
const cors = require('cors');
const { logger } = require('./src/middleware/logEvents');
const { errorHandler } = require('./src/middleware/errorHandler');
const verifyJWT = require('./src/middleware/verifyJWT');
const credentials = require('./src/middleware/credentials');
const corsOptions = require('./src/config/corsOptions');
const connectToDatabase = require('./src/config/databaseConnection');

const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectToDatabase();

// Custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// CORS
app.use(cors(corsOptions));

// Middleware to handle urlencoded data ie: form data
// 'content-type: 'application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// Middleware for json
app.use(express.json());

// Middleware for cookies
app.use(cookieParser());

// serve static files
app.use('/', express.static(path.join(__dirname, '/public')));
app.use(express.static(__dirname, { dotfiles: 'allow' }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Routes
app.use('/routes.js');
app.use(verifyJWT);

app.all('*', (req, res) => {
  res.status(404);

  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else {
    res.type('txt').send('404 Not found');
  }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
  console.log('Connected to database');

  const serverIsInProductionMode = process.env.IS_PRODUCTION;

  if (serverIsInProductionMode) {
    // Certificate
    const privateKey = fs.readFileSync(`${process.env.LETSENCRYPT_PATH}/privkey.pem`, 'utf8');
    const certificate = fs.readFileSync(`${process.env.LETSENCRYPT_PATH}/cert.pem`, 'utf8');
    const certificateAuthority = fs.readFileSync(`${process.env.LETSENCRYPT_PATH}/chain.pem`, 'utf8');

    const certbotCredentials = {
      key: privateKey,
      cert: certificate,
      ca: certificateAuthority,
    };

    pem.createCertificate({ days: 1, selfSigned: true }, (err) => {
      if (err) {
        throw err;
      }

      https.createServer(certbotCredentials, app).listen(PORT, () => {
        console.log(`Server running on port ${PORT}.\nCurrent build: PRODUCTION`);
      });
    });
  } else {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}.\nCurrent build: DEV`);
    });
  }
});
