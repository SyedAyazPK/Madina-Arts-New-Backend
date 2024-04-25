const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const couponSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  expiresAt: {
    type: Date,
    default: Date.now,
  },
  deleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
});

// couponSchema.pre("save", function (next) {
//   const coupon = this;
//   const expiresInMs = coupon.expiresAt.getTime() - Date.now();

//   // Set a timer to expire the product
//   setTimeout(async () => {
//     await Coupon.deleteOne({ _id: coupon._id });
//   }, expiresInMs);

//   next();
// });

module.exports = model("Coupon", couponSchema);
