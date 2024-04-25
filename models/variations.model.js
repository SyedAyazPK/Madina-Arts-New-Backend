const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const variationSchema = new Schema({
  attribute: {
    type: Schema.Types.ObjectId,
    ref: "Attributes",
  },
  variation: {
    type: String,
    require: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
  },
});

variationSchema.pre(/^find/, function () {
  this.populate({
    path: "attribute",
  });
});

module.exports = mongoose.model("Variation", variationSchema);
