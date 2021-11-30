const mongoose = require("mongoose");
// const crypto = require("crypto");
// user schema
const assessmentModel = new mongoose.Schema(
  {
    user_id: { type: String, default: "" },
    result: { type: String, default: "" },
    code: { type: String, default: "" },
    companion: { type: Object },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AssessmentRes", assessmentModel);
