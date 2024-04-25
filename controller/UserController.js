"use-strict";
const router = require("express")();
const { httpsCodes } = require("../config/contants");
const userManager = require("../managers/UserManager");
const { logger } = require("../config/winstonLogger");

// =========== Update =======
router.patch("/:id", async (req, res, next) => {
  const { id } = req.params;
  const reqObj = Object.assign({}, req.body);

  userManager
    .updateUser(id, reqObj)
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
// ======== Delete Many =========
router.post("/deleteMany", async (req, res, next) => {
  const reqObj = Object.assign({}, req.body);
  userManager
    .deleteManyUsers(reqObj)
    .then((result) => {
      logger.info(result.message);
      res.status(httpsCodes.SUCCESS_CODE).json(result);
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
  userManager
    .deleteUser(id)
    .then((result) => {
      logger.info(result.message);
      res.status(httpsCodes.SUCCESS_CODE).json(result);
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

// ======= GET All with or Without  Query ======
router.get("/", async (req, res, next) => {
  userManager
    .getUser(req.query)
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

// ======= GET All with or Without  Query ======
router.get("/search", async (req, res, next) => {
  userManager
    .searchUser(req.query)
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
