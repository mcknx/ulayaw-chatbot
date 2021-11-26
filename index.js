const express = require("express");
const bodyParser = require("body-parser");
// var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var morgan = require("morgan");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");
var asdfjkl = require("asdfjkl");

const { translate } = require("@paiva/translation-google");

var Sentiment = require("sentiment");
var writeGood = require("write-good");

var suggestions = writeGood(
  "tackle that I rushed to anger because I did not get married by Mom"
);
console.log(suggestions);
var textRes;

var sentiment = new Sentiment();

// gigil na gigil ako sa galit dahil pinagalitan nanaman ako ni nanay

// Ako ay naiinis na sa aking tatay kasi para siyang tanga

// naiinis ako kay tatay kasi para siyang tanga

// naiinis na talaga ako kay papa kasi para siyang tanga

// Pinarusahan nang panginoon ang mga makasasala dahil ito ay nararapat sa kanila at ang mga gawaing ito ay hindi pinapayagan sa sampung commandments

// Ako ay may lobo na lumipad sa langit. Hindi ko na nakita ito, kasi pala ay pumutok na. Sinayang ko lang ang pera ko na binili ko ng lobo kung binili ko ng pagkain sana nabusog na ako.

// Ang bahay ko na kubo, kahit ito ay munti ngunit ang mga halaman doon ay sari sari. Meron itong Singkamas at talong, sigarilyas at mani, sitaw, bataw, patani

// Naisip mo na ba o sinubukang patayin ang iyong sarili?

// Hindi kailanman
// Ito ay isang panandaliang pag-iisip lamang
// Pinlano ko minsan na patayin sarili ko subalit hindi ko ginawa ito
// Pinlano ko minsan na patayin sarili ko kasi gusto ko na talagang mamatay
// Sinubukan kong patayin ang sarili ko, pero ayaw kong mamatay
// Sinubukan kong patayin ang aking sarili, at talagang umaasa akong mamatay

// @paiva/translation-google
// translate("I'm really disgusted with papa because he's such a fool", {
//   from: "tl",
//   to: "en",
// })
//   .then((res) => {
//     console.log("@paiva/translation-google");
//     console.log(res.text);
//     //
//     console.log(res.from.text.autoCorrected);

//     //=> 这是Google翻译
//     console.log(res.from.language.iso);

//     //
//     console.log(res.from.text.value);
//     //=> en
//     console.log(res.from.text.didYouMean);
//   })
//   .catch((err) => {
//     console.error(err);
//   });

// console.dir(textRes);
// var result = sentiment.analyze(
//   "I'm annoyed with my father because he's such a fool."
// );

// console.dir(result); // Score: -2, Comparative: -0.666
// let neg = result.negative[0];
// console.log(neg);

const config = require("./config/keys");

app.use(bodyParser.json());

if (process.env.NODE_ENV === "production") {
  // require("dotenv").config({
  //   path: process.env,
  // });
  // app.use(bodyParser.json());

  // js and css files
  app.use(express.static("client/build"));

  // index.html for all page routes
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });

  app.use(
    cors({
      origin: config.clientURL,
    })
  );
  app.use(morgan("prod"));
}
if (process.env.NODE_ENV === "development") {
  // require("dotenv").config({
  //   path: "./config/config.env",
  // });
  // app.use(bodyParser.json());
  // js and css files
  app.use(express.static("client/build"));

  // index.html for all page routes
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });

  app.use(
    cors({
      origin: config.clientURL,
    })
  );
  app.use(morgan("prod"));
}

// const mongoose = require("mongoose");
// mongoose.connect(config.mongoURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// Connect to database
connectDB();

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

// Load routes
// const authRouter = require("./routes/auth.route");
// const userRouter = require('./routes/user.route')

// Use Routes
// app.use("/api/", authRouter);
// app.use('/api', userRouter)

require("./routes/auth.route")(app);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Page Not Found",
  });
});
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
