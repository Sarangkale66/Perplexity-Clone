const { body, validationResult } = require("express-validator");

const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const registerUserValidation = [
  body("username")
    .trim()
    .isString()
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters"),
  body("email")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .trim()
    .isLength({ min: 6, max: 64 })
    .withMessage("Password must be between 6 and 64 characters"),
  body("fullName.firstName")
    .trim()
    .notEmpty()
    .withMessage("First name cannot be empty")
    .isString()
    .withMessage("First name must be a string"),
  body("fullName.lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name cannot be empty")
    .isString()
    .withMessage("Last name must be a string"),
  validateResult,
];

const loginUserValidation = [
  body("username")
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .trim()
    .isLength({ min: 6, max: 64 })
    .withMessage("Password must be between 6 and 64 characters"),
  validateResult,
];

const createChatValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty"),
  validateResult,
];

module.exports = {
  registerUserValidation,
  loginUserValidation,
  createChatValidation,
};
