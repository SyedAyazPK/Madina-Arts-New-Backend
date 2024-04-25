"use strict";
const router = require("express")();
const { httpsCodes } = require("../config/contants");
const blockedCustomerManager = require("../managers/BlockedCustomerManager");
const { logger } = require("../config/winstonLogger");

//======= CREATE ========
router.post("/", async (req, res, next) => {
  const reqObj = Object.assign({}, req.body);

  blockedCustomerManager
    .createBlockedCustomer(reqObj)
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
  const { id } = req.params;

  blockedCustomerManager
    .getBlockedCustomer(id)
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
  blockedCustomerManager
    .getAllBlockedCustomer(req)
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

  blockedCustomerManager
    .updateBlockedCustomer(id, reqObj)
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
// router.delete("/:id", async (req, res, next) => {
//   const { id } = req.params;

//   brandManager
//     .deleteBrand(id)
//     .then((result) => {
//       logger.info(result.message);
//       res.status(result.status).json(result);
//     })
//     .catch(async (error) => {
//       console.log(error);
//       logger.error(error);
//       res.send({
//         error: error,
//         status: httpsCodes.SERVER_ERROR_CODE,
//       });
//     });
// });

module.exports = router;
