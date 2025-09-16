const Redis = require("ioredis");

const { REDIS_PORT, REDIS_HOST, REDIS_PASSWORD } = process.env;

const redis = new Redis({
  port: Number(REDIS_PORT) || 6379,
  host: REDIS_HOST || "127.0.0.1",
  password: REDIS_PASSWORD || undefined,
});

redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("ready", () => {
  console.log("🚀 Redis ready for commands");
});

// redis.on("error", (err) => {
//   console.error("❌ Redis error:", err);
// });

module.exports = redis;