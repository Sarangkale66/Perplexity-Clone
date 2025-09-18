const messageModel = require("../model/message.model");

const getMessages = async (req, res) => {
  try {
    const { chatId } = req.query;
    let { limit = 20, page = 1 } = req.query;

    if (!chatId) {
      return res.status(400).json({ error: "chatId is required" });
    }

    limit = Number(limit);
    page = Number(page);

    const messages = await messageModel.find({ chat: chatId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await messageModel.countDocuments({ chat: chatId });

    res.json({
      messages: messages,
      hasMore: page * limit < total,
    });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getMessages
};