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

// app.get("/", (req, res) => {
//   res.send({ hi: "awawawawas" });
// });

if (process.env.NODE_ENV === "production") {
  // js and css files
  app.use(express.static("client/build"));

  // index.html for all page routes
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
const PORT = process.env.PORT || 5000;
app.listen(PORT);

// const StanfordCoreNLPClient = require("corenlp-client");
// // http://localhost:9000
// const client = new StanfordCoreNLPClient(
//   "https://corenlp.run",
//   "tokenize,ssplit,parse,pos"
// );

// client
//   .annotate("I feel like I am not at a good state of mind.")
//   // .annotate("I am a bad person")
//   .then((result) => console.log(JSON.stringify(result, null, 2)));

// In ABC model We need to guide the user through a series of questions and prompts
// Expected flow during ABC CBT therapy
// Flow 1.Describe the adverse situation (event that has already happend or is going to happen that the user is stressed about) (Activating Event) -> internal or external
// 1. Can you

// Flow  2. Beliefs about event -> rational or irrational

// Flow  3. Consequence(s) -> positive or negative
// if internal
// Are they sharing their thoughts, feelings,

// -----> English

// I used to cut myself
// Subject (I)
// Relation = verb (cut)
// Object = (myself)

// I want to commit suicide
// Subject (I)
// Relation = verb (commit)
// Object = (suicide)

// -----> Filipino

// I used to cut myself
// Relation = verb (cut)
// Subject (I)
// Object = (myself)

// Gusto kong magpakamatay
// Relation = verb (Gusto)
// Subject (Ko)
// Object = (Magpakamatay)

// ----->
// My life is completely normal yet I feel empty inside.
// I am not sure if I am depressed
