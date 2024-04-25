"use strict";
const { httpsCodes } = require("../config/contants");
const { language } = require("../language/en/language");
const { sendEmail } = require("../modules/helpers");
const Checkout = require("../models/checkout.model");
const Categories = require("../models/categories.model.js");
const Order = require("../models/order.model");
const fs = require("fs");
const path = require("path");
const productsModel = require("../models/products.model");
const Sales = require("../models/sales.model");
const User = require("../models/user.model");
const Variation = require("../models/variations.model");
const BlockedCustomer = require("../models/blockedCustomer.model");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const { pdfGenerator } = require("../modules/pdfGenerator");

class CheckoutManager {
  // ============ Create ========
  static async createCheckout(req) {
    try {
      let result = "";

      result = { status: httpsCodes.NOT_FOUND, message: language.NOT_FOUND };

      const User = req?.user;
      // if (
      //   !User ||
      //   User.role !== "DropShipper" ||
      //   ["Pending", "Unqualified"].includes(User?.info?.status)
      // ) {
      //   return (result = {
      //     status: 400,
      //     message: "You Are Not Authorized To Do This Action",
      //   });
      // }

      await Promise.all(
        req.body.products.map(async (product) => {
          const findProduct = await productsModel.findById(product?.id);
          if (findProduct?.type === "Simple") {
            if (findProduct?.stock < product?.quantity) {
              return (result = {
                status: 400,
                message: "Buying Quantity Must Be Less Than Product Quantity",
              });
            } else {
              await productsModel.findByIdAndUpdate(product?.id, {
                stock: findProduct.stock - product?.quantity,
              });
            }
          } else {
            const findVariableProduct = await productsModel.find({
              "variations.variationIds": { $all: product?.variation },
            });
            if (findVariableProduct?.variations?.stock < product?.quantity) {
              return (result = {
                status: 400,
                message: "Buying Quantity Must Be Less Than Product Quantity",
              });
            } else {
              await productsModel.findOneAndUpdate(
                { "variations.variationIds": { $all: product?.variation } },
                {
                  $inc: {
                    "variations.stock": -product?.quantity,
                  },
                }
              );
            }
          }
        })
      );
      //Check if the user is blocked
      const blockedCustomer = await BlockedCustomer.findOne({
        phoneNumber: req.body.phone,
        isBlocked: true,
      });

      if (blockedCustomer) {
        return {
          status: httpsCodes.SUCCESS_CODE,
          message: language.BLOCKED,
        };
      }
      // GENERATE PDF FILE
      const {
        fname,
        lname,
        email,
        phone,
        sumOfSellPrice,
        method,
        totalQty,
        totalPrice,
      } = req.body;
      const data = {
        fname,
        lname,
        email,
        phone,
        sumOfSellPrice:
          sumOfSellPrice === undefined ? totalPrice : sumOfSellPrice,
        method,
        totalQty,
        status: "Processing",
      };
      const message = {
        to: req.body?.email,
        subject: "Order Received",
        description:
          "Congratulations and thank you for choosing us! Your order has been successfully Received.",
      };
      const adminMessage = {
        to: "admin",
        subject: "Order Received",
        description: "new order received",
      };
      const pdf = await pdfGenerator(data);
      // MAIL THE DETAILS
      await Promise.all([sendEmail(message, pdf), sendEmail(adminMessage)]);

      const checkout = await Checkout.create(req.body);
      const order = await Order.create({
        checkout: checkout._id,
        userId: req?.user?.id || null,
      });

      const saveCheckout = await Checkout.findById(checkout._id);

      return {
        status: httpsCodes.SUCCESS_CODE,
        message: language.ONE_RECORD_CREATE,
        data: { ...saveCheckout, orderId: order._id },
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // =========== Get All ============
  static async getAllCheckout() {
    try {
      let result = "";
      const data = await Checkout.find();
      result = { status: httpsCodes.NOT_FOUND, message: language.NOT_FOUND };

      if (data.length !== 0) {
        result = {
          status: httpsCodes.SUCCESS_CODE,
          counts: data.length,
          message: language.RECORD_FOUND,
          result: data,
        };
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  // ======= GET BY ID ======
  static async getCheckout(req) {
    try {
      let result = "";

      if (req?.user?._id) {
        var data = await Checkout.find({ user: req.user._id });
      }
      result = { status: httpsCodes.NOT_FOUND, message: language.NOT_FOUND };

      if (data) {
        result = {
          status: httpsCodes.SUCCESS_CODE,
          message: language.RECORD_FOUND,
          result: data,
        };
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  // ========== Update =========
  static async updateCheckout(id, reqBody) {
    try {
      let result = "";

      const data = await Checkout.findByIdAndUpdate(id, reqBody, { new: true });

      result = { status: httpsCodes.NOT_FOUND, message: language.NOT_FOUND };

      if (data) {
        result = {
          status: httpsCodes.CREATED,
          message: language.ONE_RECORD_UPDATE,
          result: data,
        };
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  // ======== Delete =========
  static async deleteCheckout(req) {
    try {
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CheckoutManager;
