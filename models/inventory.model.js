const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const inventorySchema = new Schema({
  manageStock: {
    type: Boolean,
    default: false,
  },
  holdStock: {
    type: String,
    required: true,
  },
  notification: {
    type: String,
    enum: ["lowStock", "outStock"],
  },
  enableNotifications: {
    type: Boolean,
    default: false,
  },
  notificationReciept: {
    type: String,
    required: true,
  },
  lowStockThreshold: {
    type: Number,
    default: 0,
  },
  outOfStockThreshold: {
    type: Number,
    default: 0,
  },
  hideProducts: {
    type: Boolean,
    default: false,
  },
});

module.exports = model("Inventory", inventorySchema);
