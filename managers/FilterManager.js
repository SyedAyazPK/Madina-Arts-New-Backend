"use strict";
const { httpsCodes } = require("../config/contants");
const { language } = require("../language/en/language");
const Product = require("../models/products.model");

class ProductManager {
  // =========== Get All ============
  static async getAllProduct(reqObj) {
    try {
      let filters = {};
      // let sort = {};
      if (reqObj && reqObj?.brand && reqObj?.brand?.length > 0) {
        filters.brand = { $in: reqObj.brand };
      }
      if (reqObj && reqObj?.category && reqObj?.category?.length > 0) {
        filters.category = { $in: reqObj.category };
      }
      // if (reqObj && reqObj?.sortBy && reqObj?.sortBy == "LowToHigh") {
      //   sort.price = 1;
      // }
      // if (reqObj && reqObj?.sortBy && reqObj?.sortBy=="LowToHigh") {
      //   sort.price = -1;
      // }
      console.log("filters==============>", filters);
      let result = "";
      const data = await Product.find({ ...filters, deleted: false });
      result = { status: httpsCodes.NOT_FOUND, message: language.NOT_FOUND };
      if (data?.length > 0) {
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
}

module.exports = ProductManager;
