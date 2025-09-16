const mongoose = require("mongoose")

const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  title: {
    type: String,
    default: "New Chat"
  }
}, { timestamps: true })

module.exports = mongoose.model("chat", chatSchema);