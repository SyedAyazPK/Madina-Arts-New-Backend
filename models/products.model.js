const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Categories",
    },
    type: {
      type: String,
      enum: ["Simple", "Variable"],
      required: true,
    },
    price: {
      type: Number,
    },
    weight: {
      type: Number,
      required: false,
    },
    discountedPrice: {
      type: Number,
    },
    variations: [
      {
        variationIds: [
          {
            type: mongoose.Schema.ObjectId,
            ref: "Variation",
          },
        ],
        productSku: {
          type: String,
          unique: true,
          required: false,
          sparse: true,
        },
        price: {
          type: Number,
        },
        weight: {
          type: Number,
          required: false,
        },
        discountedPrice: {
          type: Number,
        },
        stock: {
          type: Number,
        },
        inventory: {
          type: Boolean,
          default: false,
        },
        description: {
          type: String,
        },
        shortDescription: {
          type: String,
        },
        images: [String],
      },
    ],
    productSku: {
      type: String,
      unique: true,
      required: false,
      sparse: true,
    },
    stock: {
      type: Number,
    },
    inventory: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
    },
    shortDescription: {
      type: String,
    },
    status: {
      type: String,
      enum: ["draft", "published", "deleted"],
      default: "draft",
    },
    images: [String],
    // deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

productSchema.pre(/^find/, function () {
  this.populate({
    path: "brand",
  });
  this.populate({
    path: "category",
  });
  this.populate({
    path: "variations.variationIds",
  });
});

module.exports = model("Product", productSchema);
