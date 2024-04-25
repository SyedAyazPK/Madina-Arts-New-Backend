"use strict";
const { httpsCodes } = require("../config/contants");
const { language } = require("../language/en/language");
const Cart = require("../models/cart.model");

class CartManager {
  // ============ Create ========
  static async createCart(reqObj) {
    try {
      let result = "";
      const doc = new Cart(reqObj);
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
  static async getCart(req) {
    try {
      let result = "";

      if (req?.user?._id) {
        var data = await Cart.find({ user: req.user._id });
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

  // =========== Get All ============
  static async getAllCart() {
    try {
      let result = "";
      const data = await Cart.find();
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
  static async updateCart(id, reqBody) {
    try {
      let result = "";

      const data = await Cart.findByIdAndUpdate(id, reqBody, { new: true });

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
  static async deleteCart(id) {
    try {
      let result = "";
      result = { status: httpsCodes.NOT_FOUND, message: language.NOT_FOUND };

      const data = await Cart.findByIdAndDelete(id);

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

module.exports = CartManager;
