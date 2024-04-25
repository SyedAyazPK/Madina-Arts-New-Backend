const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const shippingProviderSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    totalOrders: {
      type: Number,
      required: true,
      default: 0,
    },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

module.exports = model("ShippingProvider", shippingProviderSchema);
