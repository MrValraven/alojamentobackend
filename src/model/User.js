const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: String,
  name: {
    type: String,
    required: false,
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  roles: {
    user: {
      type: String,
      default: 'user',
    },
    admin: String,
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = mongoose.model('User', userSchema);
