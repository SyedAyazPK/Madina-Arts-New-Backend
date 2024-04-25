const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        stock: {
          type: Number,
          default: 1,
          required: true,
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
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// cartSchema.pre(/^find/, function () {
//   this.populate({
//     path: "product",
//   });
// });

module.exports = model("Cart", cartSchema);
