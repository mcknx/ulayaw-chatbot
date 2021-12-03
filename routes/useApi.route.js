const express = require("express");
const router = express.Router();

// import controller
// const { requireSignin } = require("../controllers/auth.controller");
const { googleTranslate } = require("../controllers/useApi.controller");
const {
  understandUserInputController,
} = require("../controllers/useApi.controller");

// router.get("/user/:id", requireSignin, readController);
router.get("/useApi/translate/:words", googleTranslate);
router.get("/useApi/understand/:words", understandUserInputController);
// router.post("/useApi/showPDF", showPDFController);
// router.post("/useApi/understand", understandUserInputController);

// router.put('/user/update', requireSignin, updateController);
// router.put('/admin/update', requireSignin, adminMiddleware, updateController);

module.exports = router;
