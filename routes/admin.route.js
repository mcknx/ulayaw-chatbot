const express = require("express");
const router = express.Router();

const { createCodeValidator } = require("../helpers/valid");

// Load Controllers
const {
  fetchAllController,
  createCodeController,
  // facebookController
} = require("../controllers/admin.controller.js");

router.get("/admin/all", fetchAllController);
router.post("/admin/createCode", createCodeValidator, createCodeController);

module.exports = router;
