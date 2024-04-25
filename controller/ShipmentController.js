"use strict";
const router = require("express")();
const { httpsCodes } = require("../config/contants");
const shipmentManager = require("../managers/ShipmentManager");
const { logger } = require("../config/winstonLogger");
const { createObjectCsvWriter } = require("csv-writer");

//======= CREATE ========
router.post("/", async (req, res, next) => {
  const reqObj = Object.assign({}, req.body);

  shipmentManager
    .createShipment(reqObj)
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
// router.get("/:id", async (req, res, next) => {
//   const { id } = req.params;

//   shipmentManager
//     .getShipment(id)
//     .then((result) => {
//       logger.info(result.mesage);
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

// =========== Get All ============
router.get("/", async (req, res, next) => {
  shipmentManager
    .getAllShipment()
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

  shipmentManager
    .updateShipment(id, reqObj)
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

  shipmentManager
    .deleteShipment(id)
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

  shipmentManager
    .deleteManyShipment(reqObj)
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
router.get("/download-orders", async (req, res, next) => {
  try {
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=filename.csv");
    const csvWriter = createObjectCsvWriter({
      path: "filename.csv",
      header: [
        { id: "firstName", title: "First Name" },
        { id: "lastName", title: "Last Name" },
        { id: "email", title: "Email" },
        { id: "phone", title: "Phone Number" },
        { id: "country", title: "Country" },
        { id: "street", title: "Street" },
        { id: "city", title: "City" },
        { id: "state", title: "State" },
        { id: "zip", title: "Zip Code" },
        { id: "products", title: "Products Id" },
        { id: "total", title: "Total" },
        { id: "method", title: "Method" },
      ],
    });
    const data = [
      {
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        phone: "+92312345678",
        country: "Pakistan",
        street: "Street",
        city: "Fsd",
        state: "Punjab",
        zip: 38000,
        products: "e983ywihwg831y89gh",
        total: 200000,
        method: "Delivery",
      },
    ];
    csvWriter.writeRecords(data).then(() => {
      res.download("filename.csv");
    });
  } catch (error) {
    res.send({
      error: error,
      status: httpsCodes.SERVER_ERROR_CODE,
    });
  }
});

module.exports = router;
