"use strict";
const { httpsCodes } = require("../config/contants");
const { language } = require("../language/en/language");
const Category = require("../models/categories.model");

class CategoryManager {
  // ============ Create ========
  static async createCategory(reqObj) {
    try {
      let result = "";
      const doc = new Category(reqObj);
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
  static async getCategory(id) {
    try {
      let result = "";
      const data = await Category.findById(id);

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
  static async getAllCategory() {
    try {
      let result = "";
      const data = await Category.find({ deleted: false });
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
  static async updateCategory(id, reqBody) {
    try {
      let result = "";

      const data = await Category.findByIdAndUpdate(id, reqBody, { new: true });

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
  static async deleteCategory(id) {
    try {
      let result = "";
      result = { status: httpsCodes.NOT_FOUND, message: language.NOT_FOUND };

      const data = await Category.findByIdAndUpdate(id, { deleted: true });

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

  // ======== Delete Many =========
  static async deleteManyCategory(reqObj) {
    try {
      const ids = reqObj?.ids;
      const filter = { _id: { $in: ids } };
      let result = "";

      result = { status: httpsCodes.NOT_FOUND, message: language.NOT_FOUND };
      const data = await Category.updateMany(filter, { deleted: true });

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

module.exports = CategoryManager;
