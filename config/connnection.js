const mongoose = require("mongoose");

const { MONGODB_URI } = process.env;

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Error");
    console.log(error);
    process.exit(1);
  }
};
module.exports = connectDB;
