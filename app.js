"use strict";
require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const connectDB = require("./config/connnection");
const routes = require("./config/routes");

const app = express();

app.use(helmet());
app.use(cors());
require("./middlewares/Base").init(app);
require("./modules/sockets/socket").socketServer(app);
connectDB();
routes(app);

module.exports = app;
