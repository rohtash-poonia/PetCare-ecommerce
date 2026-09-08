require("dotenv").config();
const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("database connected");
  } catch (error) {
    console.log(`Database Error: Error connecting databse, ${error}`);
  }
};

module.exports = { connectDb };
