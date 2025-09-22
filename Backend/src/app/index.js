const express = require("express");
const app = express();
const { passport, configurePassport } = require("./services/googleOAuth.service");
const authRoutes = require("./routes/auth.routes");
const chatRoutes = require("./routes/chat.routes");
const messageRoutes = require("./routes/message.route");
const cookieParser = require("cookie-parser");
const middleware = require("./middleware/auth.middleware");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../../public")))

configurePassport();
app.use(passport.initialize());

app.use("/api/auth", authRoutes);

app.get("/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account"
  })
);

app.get("/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id, email: req.user.email, username: req.user.username }, process.env.JWT_SECRET, { expiresIn: "24h" });

    res.cookie("token", token);
    res.redirect("http://localhost:5173/");
  }
);

app.use(middleware.auth);
app.use("/api/chat", chatRoutes);
app.use("/api/messages", messageRoutes);

app.get(new RegExp('.*'), (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/index.html"));
});

module.exports = app;