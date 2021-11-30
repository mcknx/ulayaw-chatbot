const mongoose = require("mongoose");
// const crypto = require("crypto");
// user schema
const codeModel = new mongoose.Schema(
  {
    admin_id: { type: String, default: "1" },
    user_id: { type: String, default: "1" },
    admin_first_name: { type: String, default: "Mckeen" },
    admin_last_name: { type: String, default: "Asma" },
    admin_contact_no: { type: String, default: "" },
    admin_email: { type: String, default: "mckeenasma123@gmail.com" },
    user_email: { type: String, default: "mckeenasmarvmz@gmail.com" },
    code: { type: String, default: "" },
    companion: { type: Object, default: {} },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("codeModel", codeModel);
