"use strict";
const router = require("express")();
const { httpsCodes } = require("../config/contants");
const cashWithdrawManager = require("../managers/CashWithdrawManager");
const { logger } = require("../config/winstonLogger");

//======= CREATE ========
router.post("/", async (req, res, next) => {
  const reqObj = Object.assign({}, req.body);

  cashWithdrawManager
    .createCashWithdraw(req, reqObj)
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
  cashWithdrawManager
    .getCashWithdraw(req)
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

// =========== Get All ============
router.get("/", async (req, res, next) => {
  cashWithdrawManager
    .getAllCashWithdraw()
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

// =========== Update =======
router.patch("/:id", async (req, res, next) => {
  const { id } = req.params;
  const reqObj = Object.assign({}, req.body);

  cashWithdrawManager
    .updateCashWithdraw(id, reqObj)
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

// ======== Delete =========
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;

  cashWithdrawManager
    .deleteCashWithdraw(id)
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
