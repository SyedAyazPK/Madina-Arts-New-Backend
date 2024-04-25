const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const { generateInvoiceNumber } = require("../modules/helpers");

const orderSchema = new Schema(
  {
    orderId: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    checkout: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "Checkout",
    },

    shippingProvider: {
      type: Schema.Types.ObjectId,
      ref: "ShippingProvider",
    },
    shippedOn: {
      type: Date,
    },
    // exportStatus: {
    //   type: Boolean,
    // },
    orderStatus: {
      type: String,
      enum: ["Delivered", "Proccessing", "Cancelled"],
      default: "Proccessing",
    },
    formStatus: {
      type: String,
      enum: ["Pending", "Filled"],
      default: "Pending",
      required: true,
    },

    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },

  {
    timestamps: true,
  }
);

orderSchema.statics.findByInvoiceNumber = async (invoiceNo) => {
  try {
    const Order = mongoose.model("Order");
    const invoices = await Order.findOne({ orderId: invoiceNo });
    return invoices;
  } catch (error) {
    throw error;
  }
};

orderSchema.pre("save", async function (next) {
  try {
    var invoiceNumber;
    const Order = this.constructor;
    while (!invoiceNumber) {
      const potentialNumber = generateInvoiceNumber();
      const existingInvoice = await Order.findByInvoiceNumber(potentialNumber);
      if (!existingInvoice) {
        invoiceNumber = potentialNumber;
      }
    }
    this.orderId = invoiceNumber;
    next();
  } catch (error) {
    console.log(error);
  }
});

orderSchema.pre(/^find/, function () {
  this.populate({
    path: "userId",
  });
  this.populate({
    path: "checkout",
  });
  this.populate({
    path: "shippingProvider",
  });
});

orderSchema.pre("update", function (next) {
  const update = this.getUpdate();
  if (update.name) {
    update.name =
      update.shippingProvider.charAt(0).toUpperCase() +
      update.shippingProvider.slice(1);
  }
  next();
});

module.exports = model("Order", orderSchema);
