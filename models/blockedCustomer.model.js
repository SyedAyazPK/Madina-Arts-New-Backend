const mongoose = require("mongoose");

const blockedCustomerSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
});

const Customer = mongoose.model("BlockedCustomer", blockedCustomerSchema);

module.exports = Customer;
