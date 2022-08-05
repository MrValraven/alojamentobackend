const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
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
      default: "user",
    },
    admin: String,
  },
  posts: {
    type: Array,
    required: false,
  },
});

module.exports = mongoose.model("User", userSchema);
