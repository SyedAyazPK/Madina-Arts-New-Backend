"use strict";
const router = require("express")();
const { httpsCodes } = require("../config/contants");
const filterManager = require("../managers/FilterManager");
const { logger } = require("../config/winstonLogger");

// =========== Get All ============
router.post("/products", async (req, res, next) => {
  filterManager
    .getAllProduct(req?.body)
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
