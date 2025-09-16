const express = require("express")
const app = express();
const authRoutes = require("./routes/auth.routes");
const chatRoutes = require("./routes/chat.routes")
const cookieParser = require("cookie-parser");
const middleware = require("./middleware/auth.middleware")
const cors = require("cors")

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use(middleware.auth);
app.use("/api/chat", chatRoutes);

module.exports = app;