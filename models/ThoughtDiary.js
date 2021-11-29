const mongoose = require("mongoose");
// const crypto = require("crypto");
// user schema
const thoughtDiarySchema = new mongoose.Schema(
  {
    start_mood_1: {
      type: String,
    },
    start_mood_2: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ThoughtDiary", thoughtDiarySchema);
