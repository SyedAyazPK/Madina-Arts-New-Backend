const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const shippingZoneSchema = new Schema({
  unableShipmentMethod: {
    type: Boolean,
    required: true,
    default: true,
  },
  methodTitle: {
    type: String,
    required: true,
  },
  methodDescription: {
    type: String,
    required: true,
  },
  freeShipping: {
    type: String,
    required: true,
  },
  freeShippingLabel: {
    type: String,
    required: true,
  },
  rulesCalculation: {
    type: String,
    required: true,
  },
  cartCalculation: {
    type: String,
    required: true,
  },
  unableShippingCalculatorCart: {
    type: Boolean,
    required: true,
    default: true,
  },
  hideShippingCost: {
    type: Boolean,
    required: true,
    default: false,
  },
  shippingDesignation: {
    type: String,
    enum: [
      "defaultShippingAddress",
      "defaultBillingAddress",
      "forceShippingBillingAddress",
    ],
    required: true,
  },
  visibility: {
    type: Boolean,
    required: true,
    default: false,
  },
  zone: {
    type: String,
  },
  region: {
    type: String,
  },
  shippingCostCalculationPrice: [
    {
      when: {
        type: String,
      },
      from: {
        type: Number,
        required: true,
      },
      to: {
        type: Number,
        required: true,
      },
      ruleCost: {
        type: Number,
      },
    },
  ],
  deleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
});

module.exports = model("ShippingZone", shippingZoneSchema);
