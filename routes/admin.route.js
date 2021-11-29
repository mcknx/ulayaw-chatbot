const express = require("express");
const router = express.Router();

// Load Controllers
const {
  fetchAllController,
  // facebookController
} = require("../controllers/admin.controller.js");

router.get("/all", fetchAllController);

module.exports = router;
