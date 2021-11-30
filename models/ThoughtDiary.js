const mongoose = require("mongoose");
// const crypto = require("crypto");
// user schema
const thoughtDiarySchema = new mongoose.Schema(
  {
    user_id: { type: String, default: "" },
    td_a: { type: Array, default: ["sad", "because my dog died"] },
    td_b: { type: Array, default: ["jksaldka", "ajsldkasjld"] },
    td_c: { type: Array, default: ["asjkdaklsd", "jasdlkajdkl"] },
    td_d: { type: Array, default: ["asdjslakdj", "asdajkldklj"] },
    td_e: { type: Array, default: ["asdjslakdj", "asdajkldklj"] },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ThoughtDiary", thoughtDiarySchema);
