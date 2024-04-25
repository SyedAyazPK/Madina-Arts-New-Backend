"use strict";

const jwt = require("jsonwebtoken");

module.exports.generateToken = (userData) => {
  const payLoad = {
    // spread userData here or de-structure
    id: userData._id,
    name: userData.name,
    email: userData.email,
    role: userData?.role,
    status: userData?.info?.status,
  };

  return jwt.sign(payLoad, process.env.JWT_SECRETE_KEY, { expiresIn: "10h" });
};
