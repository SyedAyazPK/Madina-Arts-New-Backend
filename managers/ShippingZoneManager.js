"use strict";
const { httpsCodes } = require("../config/contants");
const { language } = require("../language/en/language");
const ShippingZone = require("../models/shippingZone.model");

class ShippingZoneManager {
  // ============ Create ========
  static async createShippingZone(reqObj) {
    try {
      let result = "";
      const doc = new ShippingZone(reqObj);
      const data = await doc.save();
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

  // ========== Update =========
  static async updateShippingZone(id, reqBody) {
    try {
      let result = "";

      const data = await ShippingZone.findByIdAndUpdate(id, reqBody, {
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
  static async deleteShippingZone(id) {
    try {
      let result = "";
      result = { status: httpsCodes.NOT_FOUND, message: language.NOT_FOUND };

      const data = await ShippingZone.findByIdAndUpdate(id, { deleted: true });

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

  // =========== Get All ============
  static async getAllShippingZone() {
    try {
      let result = "";
      const data = await ShippingZone.find();
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

  // =========== Get One ============
  static async getShippingZoneById(id) {
    try {
      let result = "";
      const data = await ShippingZone.findById(id);
      result = { status: httpsCodes.NOT_FOUND, message: language.NOT_FOUND };

      if (data) {
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

  // =========== Get One ============
  static async getCostByRange(weight) {
    try {
      let result = "";
      const data = await ShippingZone.aggregate([
        {
          $match: {
            shippingCostCalculationPrice: {
              $elemMatch: {
                from: { $lte: weight },
                to: { $gte: weight },
              },
            },
          },
        },
        { $unwind: "$shippingCostCalculationPrice" },
        { $limit: 1 },
      ]);

      result = { status: httpsCodes.NOT_FOUND, message: language.NOT_FOUND };

      if (data) {
        result = {
          status: httpsCodes.SUCCESS_CODE,
          counts: data.length,
          message: language.RECORD_FOUND,
          result: data[0],
        };
      }
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ShippingZoneManager;
