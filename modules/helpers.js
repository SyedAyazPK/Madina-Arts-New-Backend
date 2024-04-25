"use strict";

const jwt = require("jsonwebtoken");
const _ = require("underscore");
const nodemailer = require("nodemailer");

module.exports.reStructureData = (data) => {
  const newData =
    data &&
    data?.map((obj) => {
      const keys = Object.keys(obj);
      let ob = {};
      var ids = [];
      var title = [];
      keys &&
        keys?.map((key) => {
          ids.push(obj[key]?._id);
          title.push(obj[key]?.variation);
        });
      ob.ids = ids;
      ob.title = title.join(",");
      return ob;
    });
  return newData;
};
module.exports.isAdmin = (req, res, next) => {
  try {
    if (req?.user?.role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Access Denied" });
    }
  } catch (error) {
    throw error;
  }
};
// module.exports.isAdmin = (req, res, next) => {
//   try {
//     const currentRoute = req.originalUrl;
//     const adminRoutePattern = /^\/api\/v2\/admin\/.*$/;
//     if (adminRoutePattern.test(currentRoute)) {
//     if (req?.user?.role === "admin") {
//       next();
//     } else {
//       res.status(403).json({ message: "Access Denied" });
//     }
//     } else {
//       next();
//     }
//   } catch (error) {
//     throw error;
//   }
// };
module.exports.sendEmail = async ({ to, subject, description }, pdf) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.email",
    port: 465,
    secure: true,
    auth: {
      user: "maaan.ahmed.org@gmail.com", // generated ethereal user
      pass: "ktsxhbumifgjjxkz", // generated ethereal password
    },
  });

  const message = {
    from: "noreply@gmail.com", //
    subject: subject,
    html: description,
    // to: "abdulmanan777333@gmail.com",
  };
  if (to === "admin") {
    message.to = "abdulmanan7733@gmail.com";
  } else {
    message.to = to;
    if (pdf) {
      message.attachments = [{ filename: "order_detail.pdf", content: pdf }];
    }
  }
  const email = await transporter.sendMail(message);
  console.log("message_for_user", email);

  return email;
};

module.exports.generateInvoiceNumber = () => {
  const timestamp = Date.now().toString(); // Get the current timestamp as a string
  const randomNum = Math.floor(Math.random() * 1000); // Generate a random number between 0 and 999
  const paddedNum = randomNum.toString().padStart(3, "0"); // Pad the random number with leading zeros if necessary
  return timestamp + paddedNum;
};

module.exports.verifyJWTToken = async (token) => {
  return jwt.verify(token, process.env.JWT_SECRETE_KEY, (err, decoded) => {
    return { err: err, decoded: decoded };
  });
};

module.exports.generateCombinations = (
  attrs,
  index,
  attributes,
  combination,
  combinations = []
) => {
  if (index === attrs.length) {
    combinations.push(combination);
    return;
  }

  const attribute = attrs[index];
  const variations = attributes[attribute];

  for (let i = 0; i < variations.length; i++) {
    const newCombination = { ...combination, [attribute]: variations[i] };
    this.generateCombinations(
      attrs,
      index + 1,
      attributes,
      newCombination,
      combinations
    );
  }

  return combinations;
};
