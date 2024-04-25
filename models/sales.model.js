const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const salesSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    amount: {
      type: Number,
      required: true,
    },
    productsSales: {
      type: Number,
      required: true,
    },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Sales", salesSchema);
