const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  comment: {
    type: String,
    required: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
  },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
