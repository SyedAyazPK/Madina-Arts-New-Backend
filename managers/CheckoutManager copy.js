"use strict";
const { httpsCodes } = require("../config/contants");
const { language } = require("../language/en/language");
const { sendEmail } = require("../modules/helpers");
const Checkout = require("../models/checkout.model");
const Categories = require("../models/categories.model.js");
const Order = require("../models/order.model");
const productsModel = require("../models/products.model");
const Sales = require("../models/sales.model");
const User = require("../models/user.model");
const Variation = require("../models/variations.model");

class CheckoutManager {
  // ============ Create ========
  static async createCheckout(req) {
    try {
      const { products, totalQty, dropShipper } = req.body;

      let result = "";

      result = { status: httpsCodes.NOT_FOUND, message: language.NOT_FOUND };

      if (dropShipper?.length > 0) {
        const dropShipperUser = req?.user;
        if (
          !dropShipperUser ||
          dropShipperUser.role !== "DropShipper" ||
          ["Pending", "Unqualified"].includes(dropShipperUser.info.status)
        ) {
          throw new AppError("You Are Not Authorized To Do This Action", 409);
        }

        let benefitPrice = 0;
        let totalPrice = 0;
        const products = await Promise.all(
          dropShipper.map(async (product, i) => {
            const findProduct = await productsModel.findById(product?.product);
            if (
              findProduct?.type === "Simple" &&
              findProduct?.stock < product?.quantity
            ) {
              throw new AppError(
                "Buying Quantity Must Be Less Than Product Quantity",
                400
              );
            }

            await productsModel.findByIdAndUpdate(product?.product, {
              stock: findProduct.stock - product?.quantity,
            });

            await Categories.findByIdAndUpdate(findProduct?.category, {
              $inc: {
                revenueGenerated: product?.subtotal,
                totalSales: product?.quantity,
              },
            });

            await User.findByIdAndUpdate(dropShipperUser._id, {
              $inc: {
                "info.orders": product?.quantity,
                "info.earning": product?.benefitPrice,
              },
            });

            benefitPrice += product?.benefitPrice;
            totalPrice += product?.price;
          })
        );

        const sales = await Sales.create({
          amount: totalPrice,
          productsSales: totalQty,
        });
        const order = await Order.create({
          checkout: checkout._id,
          dropShipper: {
            shipperId: req?.user._id,
            benefit: benefitPrice,
            totalPrice,
          },
        });
      } else {
        await Promise.all(
          products.map(async (product) => {
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
                await Categories.findByIdAndUpdate(findProduct?.category, {
                  $inc: {
                    revenueGenerated: product?.subtotal,
                    totalSales: product?.quantity,
                  },
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
                await Categories.findByIdAndUpdate(
                  findVariableProduct?.category,
                  {
                    $inc: {
                      revenueGenerated: product?.subtotal,
                      totalSales: product?.quantity,
                    },
                  }
                );
              }
            }
          })
        );
      }

      const checkout = await Checkout.create(req.body);
      const order = await Order.create({
        checkout: checkout._id,
        userId: req?.user?.id,
      });

      const saveCheckout = await Checkout.findById(checkout._id);
      return {
        status: httpsCodes.SUCCESS_CODE,
        message: language.ONE_RECORD_CREATE,
        data: saveCheckout,
      };
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
