const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["User", "DropShipper", "admin"],
      default: "User",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    totalOrdersBuy: {
      type: Number,
      default: 0,
    },
    info: {
      status: {
        type: String,
        enum: ["Pending", "Unqualified", "Verified"],
        required: false,
      },
      bussniessName: {
        type: String,
        required: false,
      },
      address: {
        type: String,
        required: false,
      },
      strategy: {
        type: String,
        required: false,
      },
      cnic: {
        type: String,
        required: false,
      },
      cninFrontImage: {
        type: String,
        required: false,
      },
      cninBackImage: {
        type: String,
        required: false,
      },
      bankName: {
        type: String,
        required: false,
      },
      accountOwner: {
        type: String,
        required: false,
      },
      Iban: {
        type: String,
        required: false,
      },
      minimumWithdraw: {
        type: Number,
        default: 0,
      },
      accountNo: {
        type: String,
      },
      withdrawThreshold: {
        type: Number,
        default: 0,
      },
      requestApproval: {
        type: Boolean,
        default: false,
        required: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  try {
    if (this.password && this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  } catch (error) {
    console.log(error);
  }
});

userSchema.methods.passwordCompare = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
