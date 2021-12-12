const mongoose = require("mongoose");
// const crypto = require("crypto");
// user schema
const thoughtDiarySchema = new mongoose.Schema(
  {
    email: { type: String },
    presentEmotion: { type: String },
    step1ActivatingEvents: { type: Array },
    step1SelectedAE: { type: String },
    step2Other: { type: Array },
    step3Hot: { type: Array },
    step3Rate: { type: Number },
    step4Thoughts: { type: Array },
    step5AfterFeelings: { type: Array },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ThoughtDiary", thoughtDiarySchema);
