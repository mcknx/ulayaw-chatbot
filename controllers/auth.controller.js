const User = require("../models/auth.model");
const expressJwt = require("express-jwt");
const _ = require("lodash");
const { OAuth2Client } = require("google-auth-library");
const fetch = require("node-fetch");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJWT = require("express-jwt");
const { errorHandler } = require("../helpers/dbErrorHandling");
const sgMail = require("@sendgrid/mail");
const config = require("../config/keys");
const { translate } = require("@paiva/translation-google");
var Sentiment = require("sentiment");
sgMail.setApiKey(config.mailKey);

exports.registerController = (req, res) => {
  const {
    first_name,
    last_name,
    age,
    gender,
    contact_no,
    location,
    email,
    password,
  } = req.body;
  console.log(
    first_name,
    last_name,
    age,
    gender,
    contact_no,
    location,
    email,
    password
  );

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
  } else {
    User.findOne({
      email,
    }).exec((err, user) => {
      if (user) {
        return res.status(400).json({
          errors: "Email is taken",
        });
      }
    });

    const token = jwt.sign(
      {
        first_name,
        last_name,
        age,
        gender,
        contact_no,
        location,
        email,
        password,
      },
      config.jwtAccountActivation,
      {
        expiresIn: "5m",
      }
    );

    const emailData = {
      from: config.emailFrom,
      to: email,
      subject: "Account activation link",
      html: `
                <h1>Please use the following to activate your account</h1>
                <p>${config.clientURL}/users/activate/${token}</p>
                <hr />
                <p>This email may contain sensitive information</p>
                <p>${config.clientURL}</p>
            `,
    };

    sgMail
      .send(emailData)
      .then((sent) => {
        return res.json({
          message: `Email has been sent to ${email}`,
        });
      })
      .catch((err) => {
        return res.status(400).json({
          success: false,
          errors: errorHandler(err),
        });
      });
  }
};

exports.activationController = (req, res) => {
  const { token } = req.body;

  if (token) {
    jwt.verify(token, config.jwtAccountActivation, (err, decoded) => {
      if (err) {
        console.log("Activation error");
        return res.status(401).json({
          errors: "Expired link. Signup again",
        });
      } else {
        const {
          first_name,
          last_name,
          age,
          gender,
          contact_no,
          location,
          email,
          password,
        } = jwt.decode(token);

        console.log(email);
        const user = new User({
          first_name,
          last_name,
          age,
          gender,
          contact_no,
          location,
          email,
          password,
        });

        user.save((err, user) => {
          if (err) {
            console.log("Save error", errorHandler(err));
            return res.status(401).json({
              errors: errorHandler(err),
            });
          } else {
            return res.json({
              success: true,
              message: user,
              message: "Signup success",
            });
          }
        });
      }
    });
  } else {
    return res.json({
      message: "error happening please try again",
    });
  }
};
exports.signinController = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
  } else {
    // check if user exist
    User.findOne({
      email,
    }).exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          errors: "User with that email does not exist. Please signup",
        });
      }
      // authenticate
      if (!user.authenticate(password)) {
        return res.status(400).json({
          errors: "Email and password do not match",
        });
      }
      // generate a token and send to client
      const token = jwt.sign(
        {
          _id: user._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );
      const {
        _id,
        first_name,
        last_name,
        age,
        gender,
        contact_no,
        location,
        email,
        role,
      } = user;

      return res.json({
        token,
        user: {
          _id,
          first_name,
          last_name,
          age,
          gender,
          contact_no,
          location,
          email,
          role,
        },
      });
    });
  }
};

exports.forgotPasswordController = (req, res) => {
  const { email } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
  } else {
    User.findOne(
      {
        email,
      },
      (err, user) => {
        if (err || !user) {
          return res.status(400).json({
            error: "User with that email does not exist",
          });
        }

        const token = jwt.sign(
          {
            _id: user._id,
          },
          process.env.JWT_RESET_PASSWORD,
          {
            expiresIn: "10m",
          }
        );

        const emailData = {
          from: process.env.EMAIL_FROM,
          to: email,
          subject: `Password Reset link`,
          html: `
                    <h1>Please use the following link to reset your password</h1>
                    <p>${process.env.CLIENT_URL}/users/password/reset/${token}</p>
                    <hr />
                    <p>This email may contain sensetive information</p>
                    <p>${process.env.CLIENT_URL}</p>
                `,
        };

        return user.updateOne(
          {
            resetPasswordLink: token,
          },
          (err, success) => {
            if (err) {
              console.log("RESET PASSWORD LINK ERROR", err);
              return res.status(400).json({
                error:
                  "Database connection error on user password forgot request",
              });
            } else {
              sgMail
                .send(emailData)
                .then((sent) => {
                  // console.log('SIGNUP EMAIL SENT', sent)
                  return res.json({
                    message: `Email has been sent to ${email}. Follow the instruction to activate your account`,
                  });
                })
                .catch((err) => {
                  // console.log('SIGNUP EMAIL SENT ERROR', err)
                  return res.json({
                    message: err.message,
                  });
                });
            }
          }
        );
      }
    );
  }
};

exports.resetPasswordController = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
  } else {
    if (resetPasswordLink) {
      jwt.verify(
        resetPasswordLink,
        process.env.JWT_RESET_PASSWORD,
        function (err, decoded) {
          if (err) {
            return res.status(400).json({
              error: "Expired link. Try again",
            });
          }

          User.findOne(
            {
              resetPasswordLink,
            },
            (err, user) => {
              if (err || !user) {
                return res.status(400).json({
                  error: "Something went wrong. Try later",
                });
              }

              const updatedFields = {
                password: newPassword,
                resetPasswordLink: "",
              };

              user = _.extend(user, updatedFields);

              user.save((err, result) => {
                if (err) {
                  return res.status(400).json({
                    error: "Error resetting user password",
                  });
                }
                res.json({
                  message: `Great! Now you can login with your new password`,
                });
              });
            }
          );
        }
      );
    }
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT);
// Google Login
exports.googleController = (req, res) => {
  const { idToken } = req.body;

  client
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT })
    .then((response) => {
      // console.log('GOOGLE LOGIN RESPONSE',response)
      const {
        email_verified,
        first_name,
        last_name,
        age,
        gender,
        contact_no,
        location,
        email,
      } = response.payload;
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: "7d",
            });
            const {
              _id,
              email,
              first_name,
              last_name,
              age,
              gender,
              contact_no,
              location,
              role,
            } = user;
            return res.json({
              token,
              user: {
                _id,
                email,
                first_name,
                last_name,
                age,
                gender,
                contact_no,
                location,
                role,
              },
            });
          } else {
            // return res.status(400).json({
            //   error: "Admin with that email does not exist",
            // });
            let password = email + process.env.JWT_SECRET;
            user = new User({
              first_name,
              last_name,
              age,
              gender,
              contact_no,
              location,
              email,
              password,
              role: "admin",
            });
            user.save((err, data) => {
              if (err) {
                console.log("ERROR GOOGLE LOGIN ON USER SAVE", err);
                return res.status(400).json({
                  error: "User signup failed with google",
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
              );
              const {
                _id,
                email,
                first_name,
                last_name,
                age,
                gender,
                contact_no,
                location,
                role,
              } = data;
              return res.json({
                token,
                user: {
                  _id,
                  email,
                  first_name,
                  last_name,
                  age,
                  gender,
                  contact_no,
                  location,
                  role,
                },
              });
            });
          }
        });
      } else {
        return res.status(400).json({
          error: "Google login failed. Try again",
        });
      }
    });
};

exports.inputDatasetController = (req, res) => {
  // const { token } = req.body;
  const { inputData } = req.body;
  console.log(inputData);
  // var sentiment = new Sentiment();
  // var result = sentiment.analyze(inputData);

  // console.dir(result); // Score: -2, Comparative: -0.666
  // const errors = validationResult(req);

  // console.log(errors);

  console.log(inputData);
  // console.log(errors);

  let translated;

  // @paiva/translation-google
  translate(inputData, {
    from: "tl",
    to: "en",
  })
    .then((res) => {
      console.log("@paiva/translation-google");
      console.log(res.text);
      translated = res.from.text.value;
      //
      console.log(res.from.text.autoCorrected);

      //=> 这是Google翻译
      console.log(res.from.language.iso);

      //
      console.log(res.from.text.value);
      //=> en
      console.log(res.from.text.didYouMean);
    })
    .catch((err) => {
      console.error(err);
    });

  result = sentiment.analyze(translated);

  console.dir(result); // Score: -2, Comparative: -0.666
  // return errors;
  // const user = new User({
  //   first_name,
  //   last_name,
  //   age,
  //   gender,
  //   contact_no,
  //   location,
  //   email,
  //   password,
  // });

  // user.save((err, user) => {
  //   if (err) {
  //     console.log("Save error", errorHandler(err));
  //     return res.status(401).json({
  //       errors: errorHandler(err),
  //     });
  //   } else {
  //     return res.json({
  //       success: true,
  //       message: user,
  //       message: "Signup success",
  //     });
  //   }
  // });
};

exports.inputTranslateController = async (req, res) => {
  const { inputData } = req.body;
  console.log(inputData);

  // niaging week sukad pag announce sa deadline sa capstone

  // Simple
  // Ang buhay mismo ay ang pinaka kahanga-hangang fairy tale.
  // Ang tunay na kaluwalhatian ay nagmumula sa tahimik na pananakop sa ating sarili.

  // Compound
  // Maaaring mahirap sa una, ngunit ang lahat ay mahirap sa una.
  // Alam nating nagsi sinungaling sila, alam nilang nagsisinungaling sila, alam nilang nagsisinungaling sila, alam nating alam nating nagsisinungaling sila, pero nagsisinungaling pa rin sila.

  // @paiva/translation-google
  const translated = await translate(inputData, {
    // from: "tl",
    to: "en",
  })
    .then((res) => {
      // console.log("@paiva/translation-google");
      // console.log(res.text, "res.text");
      return res.text;
    })
    .catch((err) => {
      console.error(err);
    });

  const StanfordCoreNLPClient = require("corenlp-client");
  const client = new StanfordCoreNLPClient(
    "https://corenlp.run",
    "tokenize,ssplit,parse,pos"
  );

  // JSON.stringify(result, null, 2)

  // Other containers
  let rootWordIndex;
  let rootWordPrevCon = [];
  let rootWordNextCon = [];

  // BasicDEP containers
  // https://stackoverflow.com/questions/50431155/whats-the-tags-meaning-of-stanford-dependency-parser3-9-1

  // https://wiki.opencog.org/w/Dependency_relations

  // https://downloads.cs.stanford.edu/nlp/software/dependencies_manual.pdf
  // https://universaldependencies.org/u/dep/
  let rootWord = [];
  let nsubj = [];
  let acl = [];
  let acl_relcl = [];
  let advcl = [];
  let advmod = [];
  let advmod_emph = [];
  let advmod_lmod = [];
  let amod = [];
  let appos = [];
  let aux = [];
  let auxpass = [];
  let case1 = [];
  let cc = [];
  let cc_preconj = [];
  let ccomp = [];
  let clf = [];

  let compound = [];
  let compound_lvc = [];
  let compound_prt = [];
  let compound_redup = [];
  let compound_svc = [];
  let conj = [];
  let cop = [];
  let csubj = [];
  let csubjpass = [];
  let dep = [];
  let det_numgov = [];
  let det_nummod = [];
  let det_poss = [];
  let discourse = [];
  let dislocated = [];
  // let dobj = [];
  let expl = [];
  let expl_impers = [];
  let expl_pass = [];
  let expl_pv = [];
  // let foreign = [];
  let fixed = [];
  let flat = [];
  let flat_foreign = [];
  let flat_name = [];
  let goeswith = [];
  let iobj = [];
  let list = [];
  let mark = [];
  // let mwe = [];
  // let name = [];
  // let neg = [];
  let nmod = [];
  // let nmod_npmod = [];
  let nmod_poss = [];
  let nmod_tmod = [];
  let nsubjpass = [];
  let nummod = [];
  let nummod_gov = [];
  let obj = [];
  let obl = [];
  let obl_agent = [];
  let obl_arg = [];
  let obl_lmod = [];
  let obl_tmod = [];
  let orphan = [];
  let parataxis = [];
  let punct = [];
  // let remnant = [];
  let reparandum = [];
  let root = [];
  let vocative = [];
  let xcomp = [];

  // POS containers
  // https://stackoverflow.com/questions/1833252/java-stanford-nlp-part-of-speech-labels
  let verb = [];
  const annotatedText = await client
    .annotate(translated)
    // .annotate("I am a bad person")
    .then((result) => {
      // console.log(result.sentences[0].basicDependencies.length);
      result.sentences[0].basicDependencies.map((x) => {
        if (x.dep === "ROOT") {
          rootWord = x;
        }
        _handlePushContainer(x.dep, "acl", acl, x);
        _handlePushContainer(x.dep, "acl:relcl", acl_relcl, x);
        _handlePushContainer(x.dep, "advcl", advcl, x);
        _handlePushContainer(x.dep, "advmod", advmod, x);
        _handlePushContainer(x.dep, "advmod:emph", advmod_emph, x);
        _handlePushContainer(x.dep, "advmod:lmod", advmod_lmod, x);
        _handlePushContainer(x.dep, "amod", amod, x);
        _handlePushContainer(x.dep, "appos", appos, x);
        _handlePushContainer(x.dep, "aux", aux, x);
        _handlePushContainer(x.dep, "auxpass", auxpass, x);
        _handlePushContainer(x.dep, "case1", case1, x);
        _handlePushContainer(x.dep, "cc", cc, x);
        _handlePushContainer(x.dep, "cc:preconj", cc_preconj, x);
        _handlePushContainer(x.dep, "ccomp", ccomp, x);
        _handlePushContainer(x.dep, "clf", clf, x);
        _handlePushContainer(x.dep, "compound", compound, x);
        _handlePushContainer(x.dep, "compound:lvc", compound_lvc, x);
        _handlePushContainer(x.dep, "compound:prt", compound_prt, x);
        _handlePushContainer(x.dep, "compound:redup", compound_redup, x);
        _handlePushContainer(x.dep, "compound:svc", compound_svc, x);
        _handlePushContainer(x.dep, "conj", conj, x);
        _handlePushContainer(x.dep, "cop", cop, x);
        _handlePushContainer(x.dep, "csubj", csubj, x);
        _handlePushContainer(x.dep, "csubjpass", csubjpass, x);
        _handlePushContainer(x.dep, "dep", dep, x);
        _handlePushContainer(x.dep, "det:numgov", det_numgov, x);
        _handlePushContainer(x.dep, "det:nummod", det_nummod, x);
        _handlePushContainer(x.dep, "det:poss", det_poss, x);
        _handlePushContainer(x.dep, "discourse", discourse, x);
        _handlePushContainer(x.dep, "dislocated", dislocated, x);
        _handlePushContainer(x.dep, "expl", expl, x);
        _handlePushContainer(x.dep, "expl:impers", expl_impers, x);
        _handlePushContainer(x.dep, "expl:pass", expl_pass, x);
        _handlePushContainer(x.dep, "expl:pv", expl_pv, x);
        _handlePushContainer(x.dep, "fixe:", fixed, x);
        _handlePushContainer(x.dep, "flat", flat, x);
        _handlePushContainer(x.dep, "flat:foreign", flat_foreign, x);
        _handlePushContainer(x.dep, "flat:name", flat_name, x);
        _handlePushContainer(x.dep, "goeswith", goeswith, x);
        _handlePushContainer(x.dep, "iobj", iobj, x);
        _handlePushContainer(x.dep, "list", list, x);
        _handlePushContainer(x.dep, "mark", mark, x);
        _handlePushContainer(x.dep, "nmod", nmod, x);
        _handlePushContainer(x.dep, "nmod:poss", nmod_poss, x);
        _handlePushContainer(x.dep, "nmod:tmod", nmod_tmod, x);
        _handlePushContainer(x.dep, "nsubj", nsubj, x);
        _handlePushContainer(x.dep, "nsubjpass", nsubjpass, x);
        _handlePushContainer(x.dep, "nummod", nummod, x);
        _handlePushContainer(x.dep, "nummod_gov", nummod_gov, x);
        _handlePushContainer(x.dep, "obj", obj, x);
        _handlePushContainer(x.dep, "obl", obl, x);
        _handlePushContainer(x.dep, "obl:agent", obl_agent, x);
        _handlePushContainer(x.dep, "obl:arg", obl_arg, x);
        _handlePushContainer(x.dep, "obl:lmod", obl_lmod, x);
        _handlePushContainer(x.dep, "obl:tmod", obl_tmod, x);
        _handlePushContainer(x.dep, "orphan", orphan, x);
        _handlePushContainer(x.dep, "parataxis", parataxis, x);
        _handlePushContainer(x.dep, "punct", punct, x);
        _handlePushContainer(x.dep, "reparandum", reparandum, x);
        _handlePushContainer(x.dep, "root", root, x);
        _handlePushContainer(x.dep, "vocative", vocative, x);
        _handlePushContainer(x.dep, "xcomp", xcomp, x);
      });
      result.sentences[0].tokens.map((x) => {
        // getting the verbs
        if (
          x.pos === "VBG" ||
          x.pos === "VBD" ||
          x.pos === "VBN" ||
          x.pos === "VBG" ||
          x.pos === "VBP" ||
          x.pos === "VBZ"
        ) {
          if (!verb.includes(x)) {
            verb.push(x);
          }
        }
      });
      return result;
    });

  console.log(rootWord, "rootWord");
  console.log(root, "root");

  // console.log("So nervous ka dahil sa", verb, " tama ba ako?");
  // console.log(translated, "translates");

  // console.log(nsubj, "nsubj");
  // console.log(nsubj, "nsubj");
  // console.log(amod, "amod");
  // console.log(obl_tmod, "obl_tmod");
  // console.log(rootWordIndex, "rootWordIndex");
  return res.json({ translated, annotatedText });
};

function _handlePushContainer(val1, val2, arr, x) {
  if (val1 === val2) {
    return arr.push(x);
  }
  // return false;
}
exports.fetchAllController = async (req, res) => {
  try {
    let data = await User.find({ role: "subscriber" });
    console.log(data);
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};
