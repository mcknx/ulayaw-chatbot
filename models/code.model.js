const mongoose = require("mongoose");
// const crypto = require("crypto");
// user schema
const codeModel = new mongoose.Schema(
  {
    admin_id: { type: Boolean, default: false },
    user_id: { type: Boolean, default: false },
    admin_first_name: { type: String, default: "" },
    admin_last_name: { type: String, default: "" },
    admin_contact_no: { type: String, default: "" },
    admin_email: { type: String, default: "" },
    user_email: { type: String, default: "" },
    code: { type: String, default: "" },
    companion: { type: Object, trim: true },
    result: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("codeModel", codeModel);
