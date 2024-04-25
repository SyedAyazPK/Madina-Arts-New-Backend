"use strict";
const { httpsCodes } = require("../config/contants");
const { language } = require("../language/en/language");
const Attribute = require("../models/attributes.model");
const variation = require("../models/variations.model");

class AttributeManager {
  // ============ Create ========
  static async createAttribute(reqObj) {
    try {
      let result = "";
      const doc = new Attribute({ title: reqObj?.title });
      const data = await doc.save();
      result = { status: httpsCodes.NOT_FOUND, message: language.NOT_FOUND };
      let newVariations = [];
      if (data) {
        if (reqObj && reqObj?.variations && reqObj?.variations?.length > 0) {
          reqObj.variations?.map((variation) =>
            newVariations?.push({
              variation: variation,
              attribute: data?._id,
            })
          );
        }

        const variations = await variation.insertMany(newVariations);
        result = {
          status: httpsCodes.CREATED,
          message: language.ONE_RECORD_CREATE,
          result: { attribute: data, variations: variations },
        };
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  // ======= GET BY ID ======
  static async getAttribute(id) {
    try {
      let result = "";
      const data = await Attribute.findById(id);

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
  static async getAllAttribute() {
    try {
      let result = "";
      const data = await Attribute.find({ deleted: false });
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
  static async updateAttribute(id, reqBody) {
    try {
      let result = "";

      const data = await Attribute.findByIdAndUpdate(id, reqBody, {
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
  static async deleteAttribute(id) {
    try {
      let result = "";
      result = { status: httpsCodes.NOT_FOUND, message: language.NOT_FOUND };

      const data = await Attribute.findByIdAndUpdate(id, { deleted: true });

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
  static async deleteManyAttribute(reqObj) {
    try {
      const ids = reqObj?.ids;
      const filter = { _id: { $in: ids } };
      let result = "";

      result = { status: httpsCodes.NOT_FOUND, message: language.NOT_FOUND };
      const data = await Attribute.updateMany(filter, { deleted: true });

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

module.exports = AttributeManager;
