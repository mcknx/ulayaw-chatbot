const express = require("express");
// const bodyParser = require("body-parser");
const app = express();

const config = require("./config/keys");
const mongoose = require("mongoose");
mongoose.connect(config.mongoURI, { useNewUrlParser: true });

require("./models/Registration");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

require("./routes/dialogFlowRoutes")(app);

app.get("/", (req, res) => {
  res.send({ hi: "awawawawas" });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT);
