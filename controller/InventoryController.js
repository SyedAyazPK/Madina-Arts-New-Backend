"use strict";
const router = require("express")();
const { httpsCodes } = require("../config/contants");
const inventoryManager = require("../managers/InventoryManager");
const { logger } = require("../config/winstonLogger");

//======= CREATE ========
router.post("/", async (req, res, next) => {
  const reqObj = Object.assign({}, req.body);

  inventoryManager
    .createInventory(reqObj)
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

// ======= GET BY ID ======
router.get("/", async (req, res, next) => {
  inventoryManager
    .getInventory()
    .then((result) => {
      logger.info(result.mesage);
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
