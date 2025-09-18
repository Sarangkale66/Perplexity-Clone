const cookie = require("cookie");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const aiService = require("../services/ai.service");
const messageModel = require('../model/message.model')

function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.use((socket, next) => {
    const cookies = socket.handshake.headers.cookie;
    const { token } = cookies ? cookie.parse(cookies) : {};

    if (!token) {
      return next(new Error("Authentication Error!"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      return next(new Error("Invalid Token!"));
    }
  });

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("ai-message", async (data) => {
      await messageModel.create({
        chat: data.chatId,
        user: socket.user.id,
        role: "user",
        text: data.message
      })

      const history = (await messageModel.find({
        chat: data.chatId,
        user: socket.user.id
      })).map(message => {
        return {
          role: "user",
          parts: [
            {
              text: message.text,
            },
          ]
        }
      })

      const responseTxt = await aiService.generateContentStream(history, (chunk) => {
        socket.emit("ai-response", JSON.stringify({
          chatId: data.chatId || socket.currentRoom,
          txt: chunk
        }));
      });

      await messageModel.create({
        chat: data.chatId || socket.currentRoom,
        user: socket.user.id,
        role: "model",
        text: responseTxt
      })

    })

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  return io;
}

module.exports = initSocket;
