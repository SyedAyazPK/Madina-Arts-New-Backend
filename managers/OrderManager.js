"use strict";
const { httpsCodes } = require("../config/contants");
const { language } = require("../language/en/language");
const Order = require("./../models/order.model");
const { sendEmail } = require("../modules/helpers");
const Checkout = require("../models/checkout.model");
const Categories = require("../models/categories.model.js");
const productsModel = require("../models/products.model");
const Sales = require("../models/sales.model");
const User = require("../models/user.model");
const Variation = require("../models/variations.model");
const XLSX = require("xlsx");
const { eamilWords } = require("../config/emailWords");
class OrderManager {
  // ======= GET BY ID ======
  static async getOrder(id) {
    try {
      let result = "";
      const data = await Order.findById(id);

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
  static async getAllOrder(query) {
    try {
      let result = "";
      const data = await Order.find({ ...query, deleted: false }).sort(
        "-createdAt"
      );
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
  // =========== Get All ============
  static async getDropShipperOrders(reqObj) {
    try {
      let result = "";
      let data = "";
      if (reqObj?.role == "DropShipper") {
        data = await Order.find({ userId: reqObj.id, deleted: false });
      }

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
  // Conver Order file into EXCEL
  static async convertToExcel(query) {
    try {
      let result = "";
      let filter = {};
      if (query?.startDate && query?.endDate) {
        filter.createdAt = {
          $gte: new Date(query.startDate),
          $lt: new Date(query.endDate),
        };
      } else {
        if (query?.startDate) {
          filter.createdAt = {
            $gte: new Date(query.startDate),
          };
        }
        console.log("filter", filter);
        if (query?.endDate) {
          filter.createdAt = {
            $lt: new Date(query.endDate),
          };
        }
      }

      const data = await Order.find({ ...filter, deleted: false });
      result = { status: httpsCodes.NOT_FOUND, message: language.NOT_FOUND };

      const orders = data.map((order) => {
        const orderCheckout = order?.checkout;
        return {
          Order_id: order?.orderId,
          checkout_name: `${orderCheckout?.fname} ${orderCheckout?.lname}`,
          checkout_phone: orderCheckout?.phone,
          checkout_email: orderCheckout?.email,
          checkout_address: `${orderCheckout?.street}, ${orderCheckout?.city}, ${orderCheckout?.province}, ${orderCheckout?.country}`,
          checkout_city: orderCheckout?.city,
          checkout_total_price: orderCheckout?.totalPrice,
          checkout_total_qutantity: orderCheckout?.totalQty,
          order_notes: orderCheckout?.notes,

          checkout_products_quantity: orderCheckout?.products
            ?.map((product) => product.quantity)
            .join(),
        };
      });

      // Create an Excel workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(orders);
      XLSX.utils.book_append_sheet(workbook, worksheet, "sheet 1");

      // Convert the workbook to a buffer
      const excelBuffer = XLSX.write(workbook, {
        type: "buffer",
        bookType: "xlsx",
      });

      if (data.length !== 0) {
        result = {
          status: httpsCodes.SUCCESS_CODE,
          counts: data.length,
          message: language.RECORD_FOUND,
          result: excelBuffer,
        };
      }

      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  // ========== Update =========
  static async updateOrder(id, reqBody) {
    try {
      let result = "";
      result = { status: httpsCodes.NOT_FOUND, message: language.NOT_FOUND };

      const { orderStatus } = reqBody;
      const data = await Order.findByIdAndUpdate(id, reqBody, { new: true });

      const statusInfo = eamilWords[orderStatus] || {};

      const message = {
        to: data.checkout?.email,
        subject: statusInfo.subject || "Order Status Update",
        description: statusInfo.description || "An update regarding your order",
      };
      // DROPSHIPPER MESSAGE
      if (orderStatus === "Delivered") {
        const dsMessage = {
          to: data.userId.email,
          subject: "Order Received",
          description: "Order Received successfully to customer",
        };
        await sendEmail(dsMessage);
      }
      await sendEmail(message);
      if (data) {
        result = {
          status: httpsCodes.CREATED,
          message: language.ONE_RECORD_UPDATE,
          result: data,
        };
      }
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // ======== Delete =========
  static async deleteOrder(id) {
    try {
      let result = "";
      result = { status: httpsCodes.NOT_FOUND, message: language.NOT_FOUND };

      const data = await Order.findByIdAndUpdate(id, { deleted: true });
      if (data) {
        result = {
          status: httpsCodes.SUCCESS_CODE,
          message: language.ONE_RECORD_DELETE,
        };
      }
      // const findCheckout = await Order.findOne({ checkout: id });
      // if (findCheckout?.checkout?.dropShipper?.length > 0) {
      //   result = {
      //     status: httpsCodes.NOT_FOUND,
      //     message: "This one is dropShipper",
      //   };
      // } else {
      //   await Promise.all(
      //     findCheckout &&
      //       findCheckout?.checkout &&
      //       findCheckout?.checkout?.products &&
      //       findCheckout?.checkout?.products?.map(async (product) => {
      //         const findProduct = await productsModel.findById(
      //           product?.product
      //         );
      //         if (
      //           findProduct &&
      //           findProduct?.type &&
      //           findProduct?.type === "Simple"
      //         ) {
      //           await productsModel.findByIdAndUpdate(product?.product, {
      //             $inc: { stock: product?.stock },
      //           });
      //           await Categories.findByIdAndUpdate(findProduct?.category, {
      //             $inc: {
      //               revenueGenerated: -product?.product?.price,
      //               totalSales: -product?.stock,
      //             },
      //           });
      //         }
      //         // else {
      //         //   const selectedVariant = await Variation.findById(
      //         //     product?.selectedVariation
      //         //   );
      //         //   await Variation.findByIdAndUpdate(
      //         //     findCheckout?.selectedVariation,
      //         //     {
      //         //       $inc: {
      //         //         stock: +selectedVariant?.attributes?.quantity,
      //         //       },
      //         //     }
      //         //   );
      //         //   await Categories.findByIdAndUpdate(findProduct?.category, {
      //         //     $inc: {
      //         //       revenueGenerated: -selectedVariant?.attributes?.price,
      //         //       totalSales: -selectedVariant?.attributes?.stock,
      //         //     },
      //         //   });
      //         // }
      //       })
      //   );
      //   console.log("Simple----->", findCheckout);
      //   await Sales.updateMany({
      //     $inc: {
      //       amount: -findCheckout?.checkout?.totalPrice,
      //       productsSales: -findCheckout?.checkout?.totalQty,
      //     },
      //   });
      //   if (findCheckout?.user) {
      //     await User.findByIdAndUpdate(findCheckout?.user, {
      //       $inc: {
      //         totalSpent: -findCheckout.totalPrice,
      //         totalOrdersBuy: -findCheckout.totalQty,
      //       },
      //     });
      //     await sendEmail(
      //       findCheckout?.user,
      //       "You Checkout Cancelled",
      //       `You Checkout total price is ${findCheckout?.totalPrice} for ${findCheckout?.products?.length} and there is cancelled.. `
      //     );
      //   }

      //   const checkout = await Checkout.findByIdAndDelete(id);
      //   var order = await Order.deleteOne({
      //     checkout: id,
      //   });
      // }
      // if (findCheckout) {
      //   result = {
      //     status: httpsCodes.SUCCESS_CODE,
      //     message: language.RECORD_FOUND,
      //     result: order,
      //   };
      // }

      return result;
    } catch (error) {
      throw error;
    }
  }

  // ======== Delete Many =========
  static async deleteManyOrder(reqObj) {
    try {
      const ids = reqObj?.ids;
      const filter = { _id: { $in: ids } };
      let result = "";

      result = { status: httpsCodes.NOT_FOUND, message: language.NOT_FOUND };
      const data = await Order.updateMany(filter, { deleted: true });

      if (data) {
        result = {
          status: httpsCodes.SUCCESS_CODE,
          message: language.ONE_RECORD_DELETE,
        };
      }
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = OrderManager;
