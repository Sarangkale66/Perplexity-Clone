const { default: mongoose } = require("mongoose");

const { DB_URL } = process.env;

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL + "/cosmo" || "mongodb://localhost:27017/cosmo")
    console.log("✅ mongodb connected")
  } catch (err) {
    console.error(err)
  }
}

module.exports = connectDB;