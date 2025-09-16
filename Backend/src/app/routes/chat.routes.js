const express = require("express")
const router = express.Router();
const chatController = require("../controller/chat.controller")
const chatValidation = require("../middleware/validation.middleware")

router.post("/", chatValidation.createChatValidation, chatController.createChat);
router.get("/", chatController.getChat);

module.exports = router;