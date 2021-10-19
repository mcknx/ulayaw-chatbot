const mongoose = require("mongoose");
const { Schema } = mongoose;

const thoughtsSchema = new Schema({
  thought: String,
  counter: { type: Number, default: 0 },
});

mongoose.model("thought", thoughtsSchema);
