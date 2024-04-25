"use strict";
const router = require("express")();
const { httpsCodes } = require("../config/contants");
const checkoutManager = require("../managers/CheckoutManager");
const { logger } = require("../config/winstonLogger");

//======= CREATE ========
router.post("/", async (req, res, next) => {
  const reqObj = Object.assign({}, req.body);

  checkoutManager
    .createCheckout(req)
    .then((result) => {
      logger.info(result.message);
      res.status(result.status).json(result);
    })
    .catch(async (error) => {
      console.log(error);
      logger.error(error);
      res.send({
        error: error.message,
        status: httpsCodes.SERVER_ERROR_CODE,
      });
    });
});
//======= CREATE TEST ========
router.get("/test", async (req, res, next) => {
  const reqObj = Object.assign({}, req.body);

  checkoutManager
    .createTestCheckout(req)
    .then((result) => {
      // res.setHeader("Content-Type", "application/pdf");
      // res.setHeader(
      //   "Content-Disposition",
      //   'attachment; filename="generated.pdf"'
      // );
      logger.info(result.message);
      res.status(200).send(result.data);
    })
    .catch(async (error) => {
      console.log(error);
      logger.error(error);
      res.send({
        error: error.message,
        status: httpsCodes.SERVER_ERROR_CODE,
      });
    });
});

// =========== Get All ============
router.get("/", async (req, res, next) => {
  checkoutManager
    .getAllCheckout()
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
router.get("/:id", async (req, res, next) => {
  checkoutManager
    .getCheckout(req)
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

// =========== Update =======
router.patch("/:id", async (req, res, next) => {
  const { id } = req.params;
  const reqObj = Object.assign({}, req.body);

  checkoutManager
    .updateCheckout(id, reqObj)
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
  checkoutManager
    .deleteCheckout(req)
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
