"use-strict";
const router = require("express")();
const { httpsCodes } = require("../config/contants");
const { logger } = require("../config/winstonLogger");
const authManager = require("./../managers/AuthManager");
const bcrypt = require("bcrypt");

// ================ CREATE USER =================
router.post("/register", async (req, res, next) => {
  const reqObj = Object.assign({}, req.body);
  authManager
    .registerUserManager(reqObj)
    .then(async (result) => {
      logger.info(result.message);
      res.status(result.status).json(result);
    })
    .catch(async (error) => {
      console.log(error);
      logger.error(error);
      res.send({
        error: error,
        status: httpsCodes.SERVER_ERROR_CODE,
      });
    });
});
// =================  LOGIN USER =================
router.post("/login", async (req, res, next) => {
  const reqObj = Object.assign({}, req.body);
  authManager
    .loginUserManager(reqObj)
    .then(async (result) => {
      logger.info(result.message);
      res.status(result.status).json(result);
    })
    .catch(async (error) => {
      console.log(error);
      logger.error(error);
      res.send({
        error: error,
        status: httpsCodes.SERVER_ERROR_CODE,
      });
    });
});

//=============   FORGOT PASSWORD =================
router.post("/forgot-password", async (req, res, next) => {
  const reqObj = Object.assign({}, req.body);
});

router.post("/users/verify-otp", async (req, res, next) => {
  const reqObj = Object.assign({}, req.body);
  authManager
    .verifyOtp(reqObj)
    .then(async (result) => {
      logger.info(result.message);
      res.status(result.status).json(result);
    })
    .catch(async (error) => {
      console.log(error);
      logger.error(error);
      res.send({
        error: error,
        status: httpsCodes.SERVER_ERROR_CODE,
      });
    });
});

module.exports = router;
