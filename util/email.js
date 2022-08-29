require("dotenv").config();

const nodemailer = require("nodemailer");

const sendEmail = (emailTo, subject, messageInPlainText, messageInHTML) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  transporter.verify().then(console.log).catch(console.error);

  let mailOptions = {
    from: "alojamento@aaue.pt",
    to: emailTo,
    subject: subject,
    text: messageInPlainText,
    html: messageInHTML,
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
