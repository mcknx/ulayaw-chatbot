const express = require("express");
const bodyParser = require("body-parser");
const config = require("./config/keys");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
var asdfjkl = require("asdfjkl");
const {
  inputTranslateController,
} = require("./controllers/auth.controller.js");

var writeGood = require("write-good");

var suggestions = writeGood(
  "tackle that I rushed to anger because I did not get married by Mom"
);
console.log(suggestions);
var textRes;

require("dotenv").config({
  path: "./config/config.env",
});

const app = express();

// Connect to database
connectDB();

app.use(bodyParser.json());

// Load routes
const authRouter = require("./routes/auth.route");
const adminRouter = require("./routes/admin.route");
const userApiRouter = require("./routes/useApi.route");
// Use Routes

app.use("/api/", authRouter);
app.use("/api/", adminRouter);
app.use("/api/", userApiRouter);
// app.use("/api/", adminRouter);
// app.use('/api', userRouter)

if (process.env.NODE_ENV === "production") {
  // js and css files
  app.use(express.static("client/build"));

  // index.html for all page routes
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });

  app.use(
    cors({
      origin: process.env.CLIENT_URL,
    })
  );
  app.use(morgan("dev"));
}

if (process.env.NODE_ENV === "development") {
  // js and css files
  app.use(express.static("client/build"));

  // index.html for all page routes
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });

  app.use(
    cors({
      origin: process.env.CLIENT_URL,
    })
  );
  app.use(morgan("dev"));
}

// const mongoose = require("mongoose");
// mongoose.connect(config.mongoURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

require("./models/Registration");
require("./models/Demand");
require("./models/Coupons");
require("./routes/dialogFlowRoutes")(app);
require("./routes/fulfillmentRoutes")(app);
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Page Not Found",
  });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

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

// console.dir(textRes);
// var result = sentiment.analyze(
//   "If everyone thinks you're worthless, then maybe you need to find new people to hang out with.Seriously, the social context in which a person lives is a big influence in self-esteem.Otherwise, you can go round and round trying to understand why you're not worthless, then go back to the same crowd and be knocked down again.There are many inspirational messages you can find in social media.  Maybe read some of the ones which state that no person is worthless, and that everyone has a good purpose to their life.Also, since our culture is so saturated with the belief that if someone doesn't feel good about themselves that this is somehow terrible.Bad feelings are part of living.  They are the motivation to remove ourselves from situations and relationships which do us more harm than good.Bad feelings do feel terrible.   Your feeling of worthlessness may be good in the sense of motivating you to find out that you are much better than your feelings today."
// );

// var result = sentiment.analyze(
//   "Hello, and thank you for your question and seeking advice on this. Feelings of worthlessness is unfortunately common. In fact, most people, if not all, have felt this to some degree at some point in their life. You are not alone. Changing our feelings is like changing our thoughts - it's hard to do. Our minds are so amazing that the minute you change your thought another one can be right there to take it's place. Without your permission, another thought can just pop in there. The new thought may feel worse than the last one! My guess is that you have tried several things to improve this on your own even before reaching out on here. People often try thinking positive thoughts, debating with their thoughts, or simply telling themselves that they need to 'snap out of it' - which is also a thought that carries some self-criticism. Some people try a different approach, and there are counselors out there that can help you with this. The idea is that instead of trying to change the thoughts, you change how you respond to them. You learn skills that allow you to manage difficult thoughts and feelings differently so they don't have the same impact on you that they do right now. For some people, they actually DO begin to experience less hurtful thoughts once they learn how to manage the ones they have differently. Acceptance and Commitment Therapy may be a good choice for you. There is information online and even self-help books that you can use to teach you the skills that I mentioned. Because they are skills, they require practice, but many people have found great relief and an enriched life by learning them. As for suicidal thoughts, I am very glad to read that this has not happened to you. Still, you should watch out for this because it can be a sign of a worsening depression. If you begin to think about this, it is important to reach out to a support system right away. The National Suicide Prevention Lifeline is 1-800-273-8255. The text line is #741741. I hope some other colleagues will provide you more suggestions. Be well...Robin Landwehr, DBH, LPCC"
// );

// var result = sentiment.analyze(
//   "I'm going through some things with my feelings and myself. I barely sleep and I do nothing but think about how I'm worthless and how I shouldn't be here. I've never tried or contemplated suicide. I've always wanted to fix my issues, but I never get around to it. How can I change my feeling of being worthless to everyone?"
// );

// let neg = result.negative[0];
// console.log(neg);

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
