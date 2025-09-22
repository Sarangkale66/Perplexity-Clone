const { default: mongoose, model } = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  fullName: {
    firstName: {
      type: String
    },
    lastName: {
      type: String
    }
  },
  role: {
    type: String,
    enum: ["user", "plus"],
    default: "user"
  },
  image: {
    type: String,
    default: ""
  }
})

module.exports = model("user", userSchema);