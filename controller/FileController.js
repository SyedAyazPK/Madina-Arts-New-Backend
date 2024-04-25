"use strict";
const router = require("express")();
const { v2 } = require("cloudinary");

//======= CREATE ========
router.post("/upload", async (req, res) => {
  console.log(req.files);
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  // The name of the input field (i.e. "file") is used to retrieve the uploaded file
  const file = req.files.file;

  // Upload file to Cloudinary
  v2.uploader.upload(file?.tempFilePath, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Failed to upload file to Cloudinary.");
    }

    // Send response with URL of uploaded file
    res.status(200).send(result.url);
    console.log(result.url);
  });
});

router.post("/upload-csv", (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).send("No file uploaded");
  }

  const file = req.files.file;

  if (file.mimetype !== "text/csv") {
    return res.status(400).send("Invalid file type");
  }

  v2.uploader
    .upload(file.tempFilePath, { resource_type: "raw" })
    .then((result) => {
      res.send(result?.url);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error uploading file");
    });
});

module.exports = router;
