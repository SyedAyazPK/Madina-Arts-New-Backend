"use strict";
const { httpsCodes } = require("../config/contants");
const { language } = require("../language/en/language");
const Variation = require("../models/variations.model");
const Attribute = require("../models/attributes.model");
const { generateCombinations, reStructureData } = require("../modules/helpers");

class VariationManager {
  // ============ Create ========
  static async createVariation(reqObj) {
    try {
      let result = "";
      const doc = new Variation(reqObj);
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
  static async getVariation(id) {
    try {
      let result = "";
      const data = await Variation.findById(id);

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

  static async getCombinations() {
    try {
      let result = "";
      const attributes = await Attribute.find({
        enabled: true,
      }).select("_id title");

      if (attributes && attributes?.length > 0) {
        var atr = "";
        const promises = attributes.map(async (obj) => {
          const variants = await Variation.find({
            attribute: obj?._id,
          });
          return { [obj.title]: variants };
        });

        atr = await Promise.all(promises);
      }

      result = { status: httpsCodes.NOT_FOUND, message: language.NOT_FOUND };

      if (atr) {
        var attrsArray = {};
        atr &&
          atr?.map((obj) => {
            attrsArray[Object.keys(obj)[0]] = obj[Object.keys(obj)[0]];
          });
        const combinations = [];
        const generateCombinations = (attrs, index, combination) => {
          if (index === attrs.length) {
            combinations.push(combination);
            return;
          }
          const attribute = attrs[index];
          const variations = attrsArray[attribute];
          for (let i = 0; i < variations.length; i++) {
            const newCombination = {
              ...combination,
              [attribute]: variations[i],
            };
            generateCombinations(attrs, index + 1, newCombination);
          }
        };
        const attrs = Object.keys(attrsArray);
        generateCombinations(attrs, 0, {});
        if (combinations) {
          const newData = reStructureData(combinations);
          result = {
            status: httpsCodes.SUCCESS_CODE,
            message: language.RECORD_FOUND,
            result: { combinations: newData },
          };
        }
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  // =========== Get All ============
  static async getAllVariation() {
    try {
      let result = "";
      const data = await Variation.aggregate([
        {
          $lookup: {
            from: "attributes", // Name of the collection to perform the lookup
            localField: "attribute",
            foreignField: "_id",
            as: "attribute",
          },
        },
        {
          $unwind: "$attribute",
        },
        {
          $group: {
            _id: "$attribute",
            variations: { $push: "$variation" },
          },
        },
        {
          $project: {
            _id: 0,
            attribute: "$_id",
            variations: {
              $reduce: {
                input: "$variations",
                initialValue: "",
                in: {
                  $cond: [
                    { $eq: ["$$value", ""] },
                    "$$this",
                    { $concat: ["$$value", "|", "$$this"] },
                  ],
                },
              },
            },
          },
        },
      ]);
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
  static async updateVariation(id, reqBody) {
    try {
      let result = "";

      const data = await Variation.findByIdAndUpdate(id, reqBody, {
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
  static async deleteVariation(id) {
    try {
      let result = "";
      result = { status: httpsCodes.NOT_FOUND, message: language.NOT_FOUND };

      const data = await Variation.findByIdAndUpdate(id, { deleted: true });

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
  static async deleteManyVariation(reqObj) {
    try {
      const ids = reqObj?.ids;
      const filter = { _id: { $in: ids } };
      let result = "";

      result = { status: httpsCodes.NOT_FOUND, message: language.NOT_FOUND };
      const data = await Variation.updateMany(filter, { deleted: true });

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

module.exports = VariationManager;
