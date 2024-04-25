"use-strict";
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { httpsCodes } = require("../config/contants");
const { language } = require("../language/en/language");
const { unless } = require("express-unless");
const { verifyJWTToken, isAdmin } = require("../modules/helpers");
const { unlessRoutes } = require("../config/unlessRoutes");

const { v2 } = require("cloudinary");
const fileUpload = require("express-fileupload");

class Base {
  constructor() {}
  static init(app) {
    v2.config({
      cloud_name: "dp2gvohx7",
      api_key: "483979789592513",
      api_secret: "Dvi6wEK-c-_ZqEMnc3A4x9YQ_MA",
    });
    app.use(bodyParser.json({ limit: "5mb" }));
    app.use(bodyParser.urlencoded({ limit: "5mb", extended: false }));
    app.use(cookieParser());
    app.use(express.static("public"));
    app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      next();
    });
    app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
      })
    );
    Base.authenticate.unless = unless;
    app.use(Base.authenticate.unless(unlessRoutes));

    // app.use(isAdmin);
  }

  static async authenticate(req, res, next) {
    const token = req?.headers?.token;
    if (token) {
      const result = await verifyJWTToken(token);
      if (result.err) {
        res
          .status(httpsCodes.UNAUTHORIZE_CODE)
          .json({ message: language.INVALID_AUTH_TOKEN });
      } else {
        req.user = result.decoded;
        next();
      }
    } else {
      if (`${req?.originalUrl}` == "/api/v2/checkout" && req.method == "POST") {
        next();
      } else {
        res
          .status(httpsCodes.UNAUTHORIZE_CODE)
          .json({ message: language.NO_AUTH_GIVEN });
      }
    }
  }
}

module.exports = Base;
