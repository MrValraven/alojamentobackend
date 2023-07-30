const mongoose = require('mongoose');

const connectToDatabase = () => {
  try {
    mongoose.connect(process.env.DATABASE_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = connectToDatabase;
