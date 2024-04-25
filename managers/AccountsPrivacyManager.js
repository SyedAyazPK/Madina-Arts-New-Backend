"use strict";
const { httpsCodes } = require("../config/contants");
const { language } = require("../language/en/language");
const AccountsPrivacy = require("../models/accountPrivacy.model");

class AccountsPrivacyManager {
  // ============ Create ========
  static async createAccountsPrivacy(reqObj) {
    try {
      let result = "";
      const data = await AccountsPrivacy.findOneAndUpdate({}, reqObj, {
        upsert: true,
        new: true,
      });

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

  // =========== Get All ============
  static async getAllAccountsPrivacy() {
    try {
      let result = "";
      const data = await AccountsPrivacy.find();
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
}

module.exports = AccountsPrivacyManager;
