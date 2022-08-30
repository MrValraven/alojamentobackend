const mongoose = require("mongoose");
const { Schema } = mongoose;

const autoCounterSchema = new Schema({
  count: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("AutoCounter", autoCounterSchema);
