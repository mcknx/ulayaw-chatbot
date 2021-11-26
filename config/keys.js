if (process.env.NODE_ENV === "production") {
  // we are in production - return the prod set of keys
  module.exports = require("./prod");
  require("dotenv").config({
    path: process.env,
  });
} else {
  // we are in development - return the dev keys!!!
  module.exports = require("./dev");
  require("dotenv").config({
    path: "./config/config.env",
  });
}
