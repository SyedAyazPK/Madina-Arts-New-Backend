const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const checkoutSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    fname: String,
    lname: String,
    phone: String,
    email: String,
    country: {
      type: String,
    },
    street: {
      type: String,
      required: true,
      trim: true,
      min: 10,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    province: {
      type: String,
      required: true,
      trim: true,
    },
    zip: {
      type: Number,
      required: true,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          required: true,
        },
        sellPrice: {
          type: Number,
        },
        selectedVariation: {
          type: Schema.Types.ObjectId,
          ref: "Variation",
          required: false,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    totalQty: {
      type: Number,
      required: true,
    },
    sumOfOriginalPrice: {
      type: Number,
      required: true,
    },
    sumOfSellPrice: {
      type: Number,
      default: null,
      required: true,
    },
    method: {
      type: String,
      default: "Cash on Delivery",
    },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

checkoutSchema.pre(/^find/, function () {
  this.populate({
    path: "user",
  });
  this.populate({
    path: "products.product",
  });
});

// checkoutSchema.pre("save", function () {
//   this.populate({
//     path: "dropShipper.product",
//   });
// });

module.exports = model("Checkout", checkoutSchema);
