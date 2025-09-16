const redis = require("../db/cache");
const userModel = require("../model/user.model")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { username, email, password, fullName: { firstName, lastName } } = req.body;
  const isUserExist = await userModel.findOne({
    $or: [{ username }, { email }]
  })

  if (isUserExist) {
    res.status(442).json({
      message: " User already exists"
    });
    return;
  }

  const hashPassword = await bcrypt.hash(password, bcrypt.genSaltSync());
  let user = await userModel.create({
    username,
    email,
    fullName: {
      firstName,
      lastName
    },
    password: hashPassword,
  });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' })
  res.cookie("token", token)

  const userObj = user.toObject();
  delete userObj.password;

  res.status(201).json({
    message: "user register successfully",
    success: true,
    user: userObj
  })
}

const loginUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let user = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      res.status(401).json({
        message: "user not exists!",
        success: false
      })
      return;
    }

    const isvalid = await bcrypt.compare(password, user.password);
    if (!isvalid) {
      res.status(401).json({
        message: "Invalid credentials",
        success: false
      })
      return;
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' })

    const userObj = user.toObject();
    delete userObj.password;

    res.cookie("token", token)
    res.status(201).json({
      message: "user login successfully",
      success: true,
      user: userObj
    })

  } catch (err) {
    res.status(401).json({
      message: "Invalid credentials",
      success: false
    })
  }
}

const logoutUser = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (token) {
      const decoded = jwt.decode(token);
      console.log(decoded);

      if (!decoded || !decoded.exp) {
        res.status(400).json({ error: "Invalid token" });
        return;
      }
      const ttl = decoded.exp - Math.floor(Date.now() / 1000);
      await redis.set(`blacklist:${token}`, "true", "EX", ttl);
    }

    res.clearCookie("token");
    res.status(201).json({
      message: "user logout successfully",
      success: true
    })
  } catch (err) {
    console.error("Logout failed:", err);
    return res.status(500).json({ error: "Failed to logout" });
  }
}


module.exports = {
  registerUser,
  loginUser,
  logoutUser
}
