"use strict";
const { httpsCodes } = require("../config/contants");
const { language } = require("../language/en/language");
const Inventory = require("../models/inventory.model");

class InventoryManager {
  // ============ Create ========
  static async createInventory(reqObj) {
    try {
      let result = "";
      const doc = new Inventory(reqObj);
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
  static async getInventory() {
    try {
      let result = "";

      const data = await Inventory.find();
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
}

module.exports = InventoryManager;
