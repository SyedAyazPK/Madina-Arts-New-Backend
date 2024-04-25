"use-strict";

const { httpsCodes } = require("../config/contants");
const { language } = require("../language/en/language");
const User = require("../models/user.model");

class UserManager {
  // ======= GET All With Or Without Query ======
  static async getUser(query) {
    console.log("Customers----->", query);
    try {
      let result = "";
      const data = await User.find({
        ...query,
        deleted: false,
      });
      result = { status: httpsCodes.NOT_FOUND, message: language.NOT_FOUND };

      if (data.length > 0) {
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

  // ======= Search All With Or Without Query ======
  static async searchUser(query) {
    try {
      let result = "";
      const data = await User.find({
        name: { $regex: query?.name, $options: "i" },
        deleted: false,
      });
      result = { status: httpsCodes.NOT_FOUND, message: language.NOT_FOUND };

      if (data.length > 0) {
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
  static async updateUser(id, reqBody) {
    try {
      let result = "";

      const data = await User.findByIdAndUpdate(id, reqBody, { new: true });

      result = { status: httpsCodes.NOT_FOUND, message: language.NOT_FOUND };

      if (data) {
        result = {
          status: httpsCodes.SUCCESS_CODE,
          message: language.ONE_RECORD_UPDATE,
          result: data,
        };
      }
      return result;
    } catch (error) {
      throw error;
    }
  }
  // ======== Delete Many  =========
  static async deleteManyUsers(reqObj) {
    try {
      const ids = reqObj?.ids;
      const filter = { _id: { $in: ids } };
      let result = "";

      result = { status: httpsCodes.NOT_FOUND, message: language.NOT_FOUND };

      const data = await User.updateMany(filter, { deleted: true });

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

  // ======== Delete By Id =========
  static async deleteUser(id) {
    try {
      let result = "";

      result = { status: httpsCodes.NOT_FOUND, message: language.NOT_FOUND };

      const data = await User.findByIdAndUpdate(id, { deleted: true });

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

module.exports = UserManager;
