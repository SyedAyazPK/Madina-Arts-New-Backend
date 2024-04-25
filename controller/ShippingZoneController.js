"use strict";
const router = require("express")();
const { httpsCodes } = require("../config/contants");
const shippingZoneManager = require("../managers/ShippingZoneManager");
const { logger } = require("../config/winstonLogger");
const { isAdmin } = require("../modules/helpers");

//======= CREATE ========
router.post("/", async (req, res, next) => {
  const reqObj = Object.assign({}, req.body);

  shippingZoneManager
    .createShippingZone(reqObj)
    .then((result) => {
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

//======= UPDATE ========
router.patch("/:id", async (req, res, next) => {
  const reqObj = Object.assign({}, req.body);
  shippingZoneManager
    .updateShippingZone(req?.params?.id, reqObj)
    .then((result) => {
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

//======= Delete ========
router.delete("/:id", isAdmin, async (req, res, next) => {
  const reqObj = Object.assign({}, req.body);
  shippingZoneManager
    .deleteShippingZone(req?.params?.id)
    .then((result) => {
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

// =========== Get All ============
router.get("/", async (req, res, next) => {
  shippingZoneManager
    .getAllShippingZone()
    .then((result) => {
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

// =========== Get All ============
router.post("/shipping-cost", async (req, res, next) => {
  shippingZoneManager
    .getCostByRange(req.body?.weight)
    .then((result) => {
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
// =========== Get All ============
router.get("/:id", async (req, res, next) => {
  shippingZoneManager
    .getShippingZoneById(req?.params?.id)
    .then((result) => {
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
