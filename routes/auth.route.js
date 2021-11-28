const express = require("express");
const router = express.Router();

// Load Controllers
const {
  registerController,
  activationController,
  signinController,
  forgotPasswordController,
  resetPasswordController,
  googleController,
  // facebookController
} = require("../controllers/auth.controller.js");

const {
  validRegister,
  validLogin,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../helpers/valid");

router.post("/register", validRegister, registerController);

router.post("/login", validLogin, signinController);

router.post("/activation", activationController);
router.post(
  "/password/forget",
  forgotPasswordValidator,
  forgotPasswordController
);
router.post("/password/reset", resetPasswordValidator, resetPasswordController);
router.post("/googlelogin", googleController);

module.exports = router;
