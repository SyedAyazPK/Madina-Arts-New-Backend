const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const categoriesSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },

    image: {
      type: String,
    },
    totalSales: {
      type: Number,
      default: 0,
    },
    revenueGenerated: {
      type: Number,
      default: 0,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Categories",
    },
    __v: {
      select: false,
      type: Number,
    },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Categories", categoriesSchema);
