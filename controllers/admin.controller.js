const User = require("../models/auth.model");

exports.fetchAllController = async (req, res) => {
  try {
    let data = await User.find({ role: "subscriber" });
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};
