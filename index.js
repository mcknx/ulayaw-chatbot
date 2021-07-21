const express = require("express");
// const bodyParser = require("body-parser");
const app = express();

const config = require("./config/keys");
const mongoose = require("mongoose");
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

require("./models/Registration");
require("./models/Demand");
require("./models/Coupons");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

require("./routes/dialogFlowRoutes")(app);
require("./routes/fulfillmentRoutes")(app);

app.get("/", (req, res) => {
  res.send({ hi: "awawawawas" });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT);
