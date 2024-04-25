const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const shipmentSchema = new Schema({
  file: {
    type: String,
    required: true,
  },
  shippingDate: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  replaceTrackingInfo: {
    type: Boolean,
    default: false,
  },
  deleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
});

module.exports = model("Shipment", shipmentSchema);
