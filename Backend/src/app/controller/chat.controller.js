const chatModel = require("../model/chat.model");

const createChat = async (req, res) => {
  try {
    const { title } = req.body;

    const chat = await chatModel.create({
      title,
      user: req.user._id
    });

    res.status(201).json({
      message: "message created",
      success: true,
      chat
    })
  } catch (err) {
    res.status(401).json({
      message: "error while creating chat!",
      success: false,
    })
  }
}

const getChat = async (req, res) => {
  try {
    const chats = await chatModel.find({
      user: req.user._id
    }).sort({ createdAt: 1 })

    res.status(201).json({
      message: "read chats successfully!",
      success: true,
      chats
    })
  } catch (err) {
    res.status(401).json({
      message: "error while getting chats!",
      success: false,
    })
  }
}

module.exports = {
  createChat,
  getChat
}