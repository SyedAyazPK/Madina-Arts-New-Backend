const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const brandSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    image: {
      type: String,
    },

    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Brand", brandSchema);
