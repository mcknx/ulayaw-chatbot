const express = require("express");
// const bodyParser = require("body-parser");
const app = express();

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
