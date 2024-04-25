const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const accountPrivacySchema = new Schema({
  guestCheckout: {
    type: Boolean,
    default: false,
    required: true,
  },
  accountCreation: {
    createAccountDuringCheckout: {
      type: Boolean,
      required: true,
      default: false,
    },
    createAccountOnHomePage: {
      type: Boolean,
      required: true,
      default: true,
    },
    generateUsername: {
      type: Boolean,
      required: true,
      default: false,
    },
    setPassword: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  accountErasure: {
    type: Boolean,
    required: true,
    default: false,
  },
  personalDataRemoval: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = model("AccountPrivacy", accountPrivacySchema);
