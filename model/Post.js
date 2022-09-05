const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema({
  postSlug: {
    type: String,
    required: true,
  },
  ownerId: {
    type: String,
    required: true,
  },
  publicationDate: {
    type: Date,
    required: true,
  },
  publicationDateString: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  photos: {
    type: Array,
    required: true,
  },
  typology: {
    type: String,
    required: true,
  },
  acceptedGender: {
    type: String,
    required: true,
  },
  isFurnished: {
    type: Boolean,
    required: true,
  },
  hasKitchen: {
    type: Boolean,
    required: true,
  },
  hasLivingRoom: {
    type: Boolean,
    required: true,
  },
  isLgbtFriendly: {
    type: Boolean,
    required: true,
  },
  isPetsAllowed: {
    type: Boolean,
    required: true,
  },
  isCouplesAllowed: {
    type: Boolean,
    required: true,
  },
  isSmokingAllowed: {
    type: Boolean,
    required: true,
  },
  isExpensesIncluded: {
    type: Boolean,
    required: true,
  },
  numberOfBathrooms: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  contactName: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  contactEmail: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Post", postSchema);
