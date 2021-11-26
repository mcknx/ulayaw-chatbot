const express = require("express");
const router = express.Router();

// Load Controllers
const {
  registerController,
  activationController,
  // signinController,
  // forgotPasswordController,
  // resetPasswordController,
  // googleController,
  // facebookController
} = require("../controllers/auth.controller.js");

const {
  validRegister,
  validLogin,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../helpers/valid");

router.post("/register", validRegister, registerController);

// router.post('/login',
//     validLogin, signinController)

router.post("/activation", activationController);

// // forgot reset password
// router.put('/forgotpassword', forgotPasswordValidator, forgotPasswordController);
// router.put('/resetpassword', resetPasswordValidator, resetPasswordController);

// // Google and Facebook Login
// router.post('/googlelogin', googleController)
// router.post('/facebooklogin', facebookController)
module.exports = router;
