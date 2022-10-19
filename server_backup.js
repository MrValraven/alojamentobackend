require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const { logger } = require("./middleware/logEvents");
const { errorHandler } = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const credentials = require("./middleware/credentials");
const cookieParser = require("cookie-parser");
const subdirRouter = require("./routes/subdir");
const corsOptions = require("./config/corsOptions");
const mongoose = require("mongoose");
const connectToDatabase = require("./config/databaseConnection");
const { Http2ServerRequest } = require("http2");
const PORT = process.env.PORT;
var https = require('https')
var pem = require('pem')
const fs = require('fs');

// Certificate
const privateKey = fs.readFileSync('/etc/letsencrypt/live/alojamentoapi.aaue.pt/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/alojamentoapi.aaue.pt/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/alojamentoapi.aaue.pt/chain.pem', 'utf8');

const certbot_credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

// Connect to MongoDB
connectToDatabase();

// Custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// CORS
app.use(cors(corsOptions));

// Middleware to handle urlenconded datam ie: form data
// 'content-type: 'application/x-www-form-urlenconded'
app.use(express.urlencoded({ extended: false }));

// Middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

// serve static files
app.use("/", express.static(path.join(__dirname, "/public")));
app.use("/subdir", express.static(path.join(__dirname, "/public")));
app.use(express.static(__dirname, { dotfiles: 'allow'}));

app.use("/subdir", subdirRouter);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

//routes
app.use("/auth", require("./routes/auth"));
app.use("/edit", require("./routes/editUserInfo"));
app.use("/email", require("./routes/email"));
app.use("/forgotPassword", require("./routes/forgotPassword"));
app.use("/images", require("./routes/images"));
app.use("/logout", require("./routes/logout"));
app.use("/post", require("./routes/post"));
app.use("/refresh", require("./routes/refresh"));
app.use("/register", require("./routes/register"));
app.use("/resetPassword", require("./routes/resetPassword"));
app.use("/users", require("./routes/users"));
app.use("/verify", require("./routes/verify"));
app.use("/verifyToken", require("./routes/verifyToken"));

app.use(verifyJWT);

app.all("*", (req, res) => {
  res.status(404);

  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("html")) {
    res.json({ error: "404 Not found" });
  } else {
    res.type("txt").send("404 Not found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to database");

  pem.createCertificate({ days: 1, selfSigned: true}, (err,keys) => {
    if (err) { throw err }
   
    https.createServer(certbot_credentials, app).listen(PORT, () => { console.log(`Server running on port ${PORT}`); })
})});
