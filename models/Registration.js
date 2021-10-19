const mongoose = require("mongoose");
const { Schema } = mongoose;

const registrationSchema = new Schema({
  name: String,
  age: Number,
  gender: String,
  registerDate: Date,
});

mongoose.model("registration", registrationSchema);
