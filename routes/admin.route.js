const express = require("express");
const router = express.Router();

const { createCodeValidator } = require("../helpers/valid");

// Load Controllers
const {
  fetchAllController,
  createCodeController,
  claimCodeController,
  addCompanionController,
  fetchUserCodeController,
  handOverController,
  thoughtDiaryController,
  thoughtDiaryAdminController,
  // facebookController
} = require("../controllers/admin.controller.js");

router.get("/admin/all", fetchAllController);
router.get("/admin/:email", fetchUserCodeController);
router.post("/admin/createCode", createCodeValidator, createCodeController);
router.post("/admin/claimCode", claimCodeController);
router.post("/admin/addCompanion", addCompanionController);
router.post("/admin/handOver", handOverController);
router.post("/admin/thoughtDiary", thoughtDiaryController);
router.get("/admin/thoughtDiaryAdmin/:email", thoughtDiaryAdminController);

module.exports = router;
