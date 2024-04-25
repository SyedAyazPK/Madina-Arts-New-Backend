const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const cashWithdrawSchema = new Schema(
  {
    dropShipperId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "rejected"],
      default: "pending",
    },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);
cashWithdrawSchema.virtual("checkoutAmount", {
  ref: "Order",
  localField: "dropShipperId",
  foreignField: "userId",
});
module.exports = model("CashWithdraw", cashWithdrawSchema);
