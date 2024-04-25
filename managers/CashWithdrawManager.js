"use strict";
const { httpsCodes } = require("../config/contants");
const { language } = require("../language/en/language");
const CashWithdraw = require("../models/cashWithdraw.model");
const Order = require("../models/order.model");
const { ObjectId } = require("mongoose").Types;

class CashWithdrawManager {
  // ============ Create ========
  static async createCashWithdraw(req, reqObj) {
    try {
      let result = "";
      const { id } = req?.user;
      // const data = await Order.aggregate([
      // {
      //   $match: { userId: new ObjectId(id), orderStatus: "Completed" },
      // },
      // {
      //   $lookup: {
      //     from: "checkouts",
      //     localField: "checkout",
      //     foreignField: "_id",
      //     as: "checkout",
      //   },
      // },
      // {
      //   $group: {
      //     _id: null,
      //     totalPrice: { $sum: "$totalPrice" },
      //   },
      // },
      // ]);
      // console.log("order-------------->", data);
      const doc = new CashWithdraw(reqObj);
      const data = await doc.save(reqObj);
      result = { status: httpsCodes.NOT_FOUND, message: language.NOT_FOUND };

      if (data) {
        result = {
          status: httpsCodes.CREATED,
          message: language.ONE_RECORD_CREATE,
          result: data,
        };
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  // ======= GET BY ID ======
  static async getCashWithdraw(req) {
    try {
      let result = "";
      let pipeline = [];

      pipeline.push(
        {
          $lookup: {
            from: "users",
            localField: "dropShipperId",
            foreignField: "_id",
            as: "DropShipper",
          },
        },
        { $unwind: "$DropShipper" },
        { $sort: { createdAt: -1 } }
      );
      if (req.query.accountNo) {
        pipeline.push({
          $match: { "DropShipper.info.accountNo": req.query.accountNo },
        });
      }
      // if (req?.user?.id) {
      var data = await CashWithdraw.aggregate(pipeline);
      // }
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
  static async getAllCashWithdraw() {
    try {
      let result = "";
      const data = await CashWithdraw.find();
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
  static async updateCashWithdraw(id, reqBody) {
    try {
      let result = "";

      const data = await CashWithdraw.findByIdAndUpdate(id, reqBody, {
        new: true,
      });

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
  static async deleteCashWithdraw(id) {
    try {
      let result = "";
      result = { status: httpsCodes.NOT_FOUND, message: language.NOT_FOUND };

      const data = await CashWithdraw.findByIdAndDelete(id);

      if (data) {
        result = {
          status: httpsCodes.SUCCESS_CODE,
          message: language.ONE_RECORD_DELETE,
          result: data,
        };
      }
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CashWithdrawManager;
