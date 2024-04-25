"use strict";
const { httpsCodes } = require("../config/contants");
const { language } = require("../language/en/language");
const Coupon = require("../models/coupon.model");

class CouponManager {
  // ============ Create ========
  static async createCoupon(reqObj) {
    try {
      let result = "";
      const doc = new Coupon(reqObj);
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
  static async getCoupon() {
    try {
      let result = "";

      if (req?.user?._id) {
        var data = await Coupon.find({ expiresAt: { $gt: Date.now() } });
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

  // ======== Delete =========
  static async deleteCoupon(id) {
    try {
      let result = "";
      result = { status: httpsCodes.NOT_FOUND, message: language.NOT_FOUND };

      const data = await Coupon.findByIdAndDelete(id);

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

module.exports = CouponManager;
