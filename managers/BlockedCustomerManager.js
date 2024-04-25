"use strict";
const { httpsCodes } = require("../config/contants");
const { language } = require("../language/en/language");
const BlockedCustomer = require("../models/blockedCustomer.model");

class BlockedCustomerManager {
  // ============ Create ========
  static async createBlockedCustomer(reqObj) {
    try {
      let result = "";
      const data = await BlockedCustomer.create(reqObj);
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
  static async getBlockedCustomer(id) {
    try {
      let result = "";
      const data = await BlockedCustomer.findById(id);

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
  static async getAllBlockedCustomer(req) {
    try {
      let result = "";
      const data = await BlockedCustomer.find({});
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
  static async updateBlockedCustomer(id, reqBody) {
    try {
      let result = "";

      const data = await BlockedCustomer.findByIdAndUpdate(id, reqBody, {
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
  // static async deleteBlockedCustomer(id) {
  //   try {
  //     let result = "";
  //     result = { status: httpsCodes.NOT_FOUND, message: language.NOT_FOUND };

  //     const data = await BlockedCustomer.findByIdAndUpdate(id, {
  //       deleted: true,
  //     });

  //     if (data) {
  //       result = {
  //         status: httpsCodes.SUCCESS_CODE,
  //         message: language.ONE_RECORD_DELETE,
  //       };
  //     }
  //     return result;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}

module.exports = BlockedCustomerManager;
