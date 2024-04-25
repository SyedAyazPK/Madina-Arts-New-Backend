"use strict";
const { httpsCodes } = require("../config/contants");
const { language } = require("../language/en/language");
const Order = require("./../models/order.model");
const User = require("./../models/user.model");
const { ObjectId } = require("mongoose").Types;
const CashWithdraw = require("./../models/cashWithdraw.model");

class OrderManager {
  // ======= GET BY ID ======
  static async getOrderCounts(reqBody) {
    try {
      const { duration } = reqBody;
      let startDate = new Date();
      let endDateWeekly = new Date();
      let endDateMonthly = new Date();
      let endDateYearly = new Date();
      let endLastTwoMonth = new Date();
      endDateWeekly.setDate(startDate.getDate() - 7);
      endDateMonthly.setMonth(startDate.getMonth() - 1);
      endLastTwoMonth.setMonth(startDate.getMonth() - 2);
      endDateYearly.setFullYear(startDate.getFullYear() - 1);

      let value = null;
      if (duration == "weekly") value = endDateWeekly;
      else if (duration == "monthly") value = endDateMonthly;
      else if (duration == "lastTowMonth") value = endLastTwoMonth;
      else if (duration == "yearly") value = endDateYearly;

      let v = {};
      if (value) {
        v = {
          createdAt: {
            $gte: value,
          },
        };
      }
      let result = "";

      const data = await Promise.all([
        Order.aggregate([
          {
            $match: {
              deleted: false,
              ...v,
            },
          },
          {
            $lookup: {
              from: "checkouts",
              localField: "checkout",
              foreignField: "_id",
              as: "checkout",
            },
          },
          {
            $unwind: "$checkout",
          },

          {
            $group: {
              _id: "$orderStatus",
              count: { $sum: 1 },
              earning: { $sum: "$checkout.totalPrice" },
            },
          },

          {
            $group: {
              _id: null,
              countsByStatus: {
                $push: {
                  status: "$_id",
                  count: "$count",
                  earning: "$earning",
                },
              },
              totalOrderCount: { $sum: "$count" },
              totalEarnings: { $sum: "$earning" },
            },
          },
        ]),
        Order.aggregate([
          {
            $match: {
              deleted: false,
              orderStatus: "Delivered",
              ...v,
            },
          },
          {
            $lookup: {
              from: "checkouts",
              localField: "checkout",
              foreignField: "_id",
              as: "checkout",
            },
          },
          {
            $unwind: "$checkout",
          },
          {
            $unwind: "$checkout.products",
          },

          {
            $lookup: {
              from: "products",
              localField: "checkout.products.product",
              foreignField: "_id",
              as: "productInfo",
            },
          },
          {
            $unwind: "$productInfo",
          },
          {
            $group: {
              _id: "$checkout.products.product",
              totalQuantitySold: { $sum: "$checkout.products.quantity" },
              productsArray: { $push: "$productInfo" },
            },
          },
        ]),
      ])
        .then(([order, product]) => {
          return { order, product };
        })
        .catch((err) => {
          console.log(err);
          throw err;
        });

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
      console.log(error);
      throw error;
    }
  }

  // ======= DropShipper Dashboard Report ======
  static async dropShipperDashboardProfits(id, reqBody) {
    try {
      const { duration } = reqBody;
      let startDate = new Date();
      let endDateWeekly = new Date();
      let endDateMonthly = new Date();
      let endDateYearly = new Date();
      let endLastTwoMonth = new Date();
      endDateWeekly.setDate(startDate.getDate() - 7);
      endDateMonthly.setMonth(startDate.getMonth() - 1);
      endLastTwoMonth.setMonth(startDate.getMonth() - 2);
      endDateYearly.setFullYear(startDate.getFullYear() - 1);
      let result = "";
      result = { status: httpsCodes.NOT_FOUND, message: language.NOT_FOUND };

      let value = null;
      if (duration == "weekly") value = endDateWeekly;
      else if (duration == "monthly") value = endDateMonthly;
      else if (duration == "lastTowMonth") value = endLastTwoMonth;
      else if (duration == "yearly") value = endDateYearly;
      let v = {};
      if (value) {
        v = {
          createdAt: {
            $gte: value,
          },
        };
      }

      const [WithDrawl, Orders, LastPayment] = await Promise.all([
        CashWithdraw.aggregate([
          {
            $match: {
              deleted: false,
              status: "completed",
              dropShipperId: new ObjectId(id),
              ...v,
            },
          },

          {
            $group: {
              _id: null,
              paidPayment: { $sum: "$amount" },
            },
          },
          {
            $project: {
              _id: 0,
              paidPayment: 1,
            },
          },
        ]),

        Order.aggregate([
          {
            $match: {
              userId: new ObjectId(id),
              deleted: false,
              ...v,
            },
          },
          {
            $lookup: {
              from: "checkouts",
              localField: "checkout",
              foreignField: "_id",
              as: "checkout",
            },
          },

          {
            $unwind: "$checkout",
          },
          {
            $group: {
              _id: "$orderStatus",
              orderCount: { $sum: 1 },
              orignalPrice: { $sum: "$checkout.sumOfOriginalPrice" },
              sellPrice: { $sum: "$checkout.sumOfSellPrice" },
            },
          },
          {
            $group: {
              _id: null,
              orders: {
                $push: {
                  orderStatus: "$_id",
                  orderCount: "$orderCount",
                  orignalPrice: "$orignalPrice",
                  sellPrice: "$sellPrice",
                },
              },
              totalOrders: { $sum: "$orderCount" },
            },
          },
          {
            $unwind: "$orders",
          },
          {
            $project: {
              _id: 0,
              orderStatus: "$orders.orderStatus",
              totalOrders: "$totalOrders",
              orderCount: "$orders.orderCount",
              totalEarning: {
                $subtract: ["$orders.sellPrice", "$orders.orignalPrice"],
              },
            },
          },
        ]), //Get Last Payment
        CashWithdraw.findOne({
          status: "completed",
        }).sort({ createdAt: -1 }),
      ]);
      const withdraw = WithDrawl.map((item) => {
        Orders.forEach((doc) => {
          if (
            doc.hasOwnProperty("orderStatus") &&
            doc["orderStatus"] === "Delivered"
          ) {
            const { totalEarning } = doc;
            const { paidPayment } = item;
            const unPaidPayment = totalEarning - paidPayment;
            doc.unPaidPayment = unPaidPayment;
            doc.paidPayment = item.paidPayment;
            doc.lastPayment = LastPayment.amount;
          }
        });
      });
      result = {
        status: httpsCodes.SUCCESS_CODE,
        message: language.RECORD_FOUND,
        result: Orders,
      };

      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = OrderManager;
