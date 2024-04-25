"use strict";
const router = require("express")();
const { httpsCodes } = require("../config/contants");
const reportManager = require("../managers/ReportManager");
const { logger } = require("../config/winstonLogger");
// const XLSX = require("xlsx");
// const User = require("../models/brand.model");
// const stream = require("stream");

router.get("/", async (req, res, next) => {
  res.status(200).json({ Resut: "Export data API" });
  //   try {
  //     const data = await User.find({});
  //     console.log("Users--------->", data);
  //     const jsonData = JSON.parse(JSON.stringify(data));
  //     const worksheet = XLSX.utils.json_to_sheet(jsonData);
  //     const workbook = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  //     // Generate a unique filename
  //     const timestamp = new Date().getTime();
  //     const filename = `data_${timestamp}.xlsx`;

  //     // Create a writable stream buffer
  //     const streamBuffer = new stream.PassThrough();
  //     const xlsxStream = XLSX.stream.to_csv(workbook);

  //     res.setHeader(
  //       "Content-Type",
  //       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  //     );
  //     res.setHeader("Content-Disposition", 'attachment; filename="data.xlsx"');

  //     // Pipe the XLSX stream to the response stream
  //     xlsxStream.pipe(streamBuffer).pipe(res);
  //   } catch (error) {
  //     console.error("Error:", error);
  //     res.status(500).send("Internal Server Error");
  //   }
});

router.get("/order", async (req, res, next) => {
  reportManager
    .getOrderCounts(req.body)
    .then((result) => {
      logger.info(result.mesage);
      res.status(result.status).json(result);
    })
    .catch(async (error) => {
      logger.error(error);
      res.send({
        error: error,
        status: httpsCodes.SERVER_ERROR_CODE,
      });
    });
});
router.post("/dropshipper-stats", async (req, res, next) => {
  reportManager
    .dropShipperDashboardProfits(req.user.id, req.body)
    .then((result) => {
      logger.info(result.mesage);
      res.status(result.status).json(result);
    })
    .catch(async (error) => {
      logger.error(error);
      res.send({
        error: error,
        status: httpsCodes.SERVER_ERROR_CODE,
      });
    });
});
module.exports = router;
