const jwt = require("jsonwebtoken");
const userModel = require("../model/user.model");
const redis = require("../db/cache");

const verifyUser = async (req, res) => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ message: "unauthorized" });
    return null;
  }

  try {
    const isBlacklisted = await redis.get(`bl:${token}`);
    if (isBlacklisted) {
      res.status(401).json({ message: "token blacklisted, please login again" });
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const cacheKey = `user:${decoded.id}`;

    let user = await redis.get(cacheKey);

    if (!user) {
      user = await userModel.findById(decoded.id).select("_id fullName role");
      if (!user) {
        res.status(403).json({ message: "unauthorized" });
        return null;
      }
      await redis.set(cacheKey, JSON.stringify(user), "EX", 3600);
    } else {
      user = JSON.parse(user);
    }

    return user;
  } catch (err) {
    console.error("JWT verification failed:", err);
    res.clearCookie("token");
    res.status(401).json({ message: "unauthorized" });
    return null;
  }
};


const auth = async (req, res, next) => {
  const user = await verifyUser(req, res);
  if (!user) return;

  req.user = user;
  next();
};

module.exports = { auth };