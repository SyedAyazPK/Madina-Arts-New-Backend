const mongoose = require("mongoose");
const { Schema } = mongoose;

const attributesSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  enabled: {
    type: Boolean,
    default: false,
  },
  deleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
});

module.exports = mongoose.model("Attributes", attributesSchema);
