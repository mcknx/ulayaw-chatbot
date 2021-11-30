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
  inputDatasetController,
  inputTranslateController,
  // fetchAllController,
  // facebookController
} = require("../controllers/auth.controller.js");

const {
  validRegister,
  validLogin,
  forgotPasswordValidator,
  resetPasswordValidator,
  validInputDatasetValidator,
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
router.post("/datasetDF", validInputDatasetValidator, inputDatasetController);
// router.post("/translate", inputTranslateController);
// router.get("/fetchUsers", fetchAllController);
module.exports = router;
