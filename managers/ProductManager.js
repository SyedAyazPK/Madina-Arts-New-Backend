"use strict";
const { httpsCodes } = require("../config/contants");
const { language } = require("../language/en/language");
const Product = require("../models/products.model");
const Order = require("../models/order.model");
const { ObjectId } = require("mongoose").Types;

class ProductManager {
  // ============ Create ========
  static async createProduct(reqObj) {
    try {
      let result = "";
      const doc = new Product(reqObj);
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

  // ======= GET BY ID ======
  static async getProduct(id) {
    try {
      let result = "";

      const data = await Product.find({ _id: id });

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

  // =========== Get Filtered Product ============
  static async getFilteredProduct(query) {
    try {
      let result = "";
      let filter = {};
      if (query?.category) {
        filter = {
          category: new ObjectId(query?.category),
        };
      }
      const data = await Product.aggregate([
        {
          $lookup: {
            from: "brands",
            localField: "brand",
            foreignField: "_id",
            as: "brand",
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },

        {
          $lookup: {
            from: "variations",
            localField: "variations.variationIds",
            foreignField: "_id",
            as: "variationData",
          },
        },
        {
          $addFields: {
            variationIds: {
              $reduce: {
                input: "$variations.variationIds",
                initialValue: [],
                in: { $concatArrays: ["$$value", "$$this"] },
              },
            },
          },
        },
        {
          $addFields: {
            lowestPrice: { $min: "$variations.price" },
            highestPrice: { $max: "$variations.price" },
          },
        },

        {
          $facet: {
            draft: [{ $match: { status: "draft" } }],
            published: [{ $match: { status: "published" } }],
            deleted: [{ $match: { status: "deleted" } }],
          },
        },
      ]);
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
  // =========== Get All ============
  static async getAllProduct(query) {
    try {
      let result = "";
      // const data = await Product.find({ ...query, deleted: false });
      let filter = {};
      if (query?.category) {
        filter = {
          category: new ObjectId(query?.category),
        };
      }
      const data = await Product.aggregate([
        {
          $match: { ...filter, status: "published" },
        },
        {
          $lookup: {
            from: "brands",
            localField: "brand",
            foreignField: "_id",
            as: "brand",
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },

        {
          $lookup: {
            from: "variations",
            localField: "variations.variationIds",
            foreignField: "_id",
            as: "variationData",
          },
        },
        {
          $addFields: {
            variationIds: {
              $reduce: {
                input: "$variations.variationIds",
                initialValue: [],
                in: { $concatArrays: ["$$value", "$$this"] },
              },
            },
          },
        },
        {
          $addFields: {
            lowestPrice: { $min: "$variations.price" },
            highestPrice: { $max: "$variations.price" },
          },
        },
      ]);
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

  // =========== Get Refund Product ============
  static async getRefundProduct(reqBody) {
    try {
      let result = "";
      //
      result = { status: httpsCodes.NOT_FOUND, message: "Service Pending" };

      return result;
    } catch (error) {
      throw error;
    }
  }
  // =========== Get Product Variations ============
  static async getProductByVariationId(reqBody) {
    try {
      const variationProductIds = reqBody?.variationIds.map(
        (id) => new ObjectId(id)
      );
      const productId = new ObjectId(reqBody?._id);

      let result = "";
      const data = await Product.aggregate([
        {
          $match: {
            _id: productId,
            "variations.variationIds": { $all: variationProductIds },
          },
        },
        {
          $lookup: {
            from: "brands",
            localField: "brand",
            foreignField: "_id",
            as: "brand",
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },

        {
          $lookup: {
            from: "variations",
            localField: "variations.variationIds",
            foreignField: "_id",
            as: "variationData",
          },
        },
      ]);
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
  static async searchProduct(query) {
    try {
      let result = "";
      const data = await Product.find({
        title: { $regex: query?.title, $options: "i" },
        deleted: false,
      });
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

  // ========== Update =========
  static async updateProduct(id, reqBody) {
    try {
      let result = "";

      const data = await Product.findByIdAndUpdate(id, reqBody, { new: true });

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
  static async deleteProduct(id) {
    try {
      let result = "";
      result = { status: httpsCodes.NOT_FOUND, message: language.NOT_FOUND };

      const data = await Product.findByIdAndDelete(id);

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

module.exports = ProductManager;
