const express = require("express");
const router = express.Router();
const validation = require("../middleware/validation.middleware");
const controller = require("../controller/auth.controller")

router.post("/register", validation.registerUserValidation, controller.registerUser);
router.post("/login", validation.loginUserValidation, controller.loginUser);
router.post("/logout", controller.logoutUser);

module.exports = router;