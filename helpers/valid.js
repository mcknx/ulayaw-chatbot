var asdfjkl = require("asdfjkl");

const { check } = require("express-validator");

exports.validRegister = [
  check("first_name", "First Name is required")
    .notEmpty()
    .isLength({
      min: 2,
      max: 32,
    })
    .withMessage("First Name must be between 2 to 32 characters"),
  check("last_name", "Last Name is required")
    .notEmpty()
    .isLength({
      min: 2,
      max: 32,
    })
    .withMessage("Last Name must be between 2 to 32 characters"),
  check("age", "Age is required")
    .notEmpty()
    .isInt({
      min: 13,
      max: 100,
    })
    .withMessage("Age must be between 13 to 100"),
  check("contact_no", "Contact Number is required")
    .notEmpty()
    .isLength({
      min: 13,
      max: 100,
    })
    .withMessage("Contact Number must be 11 digits")
    .matches(/^(09|\+639)\d{9}$/),
  check("email").isEmail().withMessage("Must be a valid email address"),
  check("password", "password is required").notEmpty(),
  check("password")
    .isLength({
      min: 6,
    })
    .withMessage("Password must contain at least 6 characters")
    .matches(/\d/)
    .withMessage("password must contain a number"),
];

exports.validLogin = [
  check("email").isEmail().withMessage("Must be a valid email address"),
  check("password", "password is required").notEmpty(),
  check("password")
    .isLength({
      min: 6,
    })
    .withMessage("Password must contain at least 6 characters")
    .matches(/\d/)
    .withMessage("password must contain a number"),
];

exports.forgotPasswordValidator = [
  check("email")
    .notEmpty()
    .isEmail()
    .withMessage("Must be a valid email address"),
];
exports.handOverValidator = [
  check("r_email")
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Must be a valid email address"),
];

exports.createCodeValidator = [
  check("email")
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Must be a valid email address"),
];

exports.resetPasswordValidator = [
  check("newPassword")
    .not()
    .isEmpty()
    .isLength({ min: 6 })
    .withMessage("Password must be at least  6 characters long"),
];

exports.validInputDatasetValidator = [
  check("inputDataset")
    .not()
    .isEmpty()
    .isLength({ min: 6 })
    .withMessage("Password must be at least  6 characters long"),
];
