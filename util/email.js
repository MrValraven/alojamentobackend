require("dotenv").config();

const nodemailer = require("nodemailer");

const sendEmail = (email, subject, url) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  transporter.verify().then(console.log).catch(console.error);

  console.log(email, url);

  let mailOptions = {
    from: "alojamento@aaue.pt",
    to: email,
    subject: subject,
    text: "A sua conta foi criada com sucesso!Por favor clique no link abaixo para verificar a sua conta",
    html: `<h1>A sua conta foi criada com sucesso!</h1><p>Por favor clique no link abaixo para verificar a sua conta</p><a href='${url}'>${url}</a>`,
  };

  transporter.sendMail(mailOptions, (error, data) => {
    if (error) {
      console.log("Error: ", error);
    } else {
      console.log("email sent");
    }
  });
};

module.exports = { sendEmail };
