const User = require("../models/auth.model");
const { validationResult } = require("express-validator");
const Code = require("../models/code.model");
const sgMail = require("@sendgrid/mail");
const config = require("../config/keys");
sgMail.setApiKey(config.mailKey);

exports.fetchAllController = async (req, res) => {
  try {
    let data = await User.find({ role: "subscriber" });
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};

exports.createCodeController = async (req, res) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   const firstError = errors.array().map((error) => error.msg)[0];
  //   return res.status(422).json({
  //     errors: firstError,
  //   });
  // } else {

  // }
  var CodeGenerator = require("node-code-generator");
  var generator = new CodeGenerator();
  var pattern = "ABC#+";
  var howMany = 100;
  var options = {};
  // Generate an array of random unique codes according to the provided pattern:
  var codes = generator.generateCodes(pattern, howMany, options);

  const {
    admin_id,
    // user_id,
    admin_first_name,
    admin_last_name,
    admin_contact_no,
    admin_email,
    email,
    // code,
    // companion,
  } = req.body;
  console.log(req.body);
  console.log(codes[0]);

  let companion = {};
  let user_id = "1";
  let uniqueCode = codes[0];
  const newCode = new Code({
    admin_id,
    user_id,
    admin_first_name,
    admin_last_name,
    admin_contact_no,
    admin_email,
    email,
    uniqueCode,
    companion,
  });

  newCode.save((err, user) => {
    if (err) {
      console.log("Save error", errorHandler(err));
      return res.status(401).json({
        errors: errorHandler(err),
      });
    } else {
      return res.json({
        success: true,
        message: user,
        message: `Code has been sent to ${email}`,
        code: uniqueCode,
      });
    }
  });

  const emailData = {
    from: config.emailFrom,
    to: email,
    subject: "Your Assessment Code from Ulayaw",
    html: `
              <h1>Please visit our website and login to this email to use this code.</h1>

              <h2>Here is your code: </h2>
              <h3>${uniqueCode}</h3>

              <p>Thank you!</p>
              <p>${config.clientURL}</p>
              <hr />
              <p>This email may contain sensitive information</p>
              <p>${config.clientURL}</p>
          `,
  };

  sgMail
    .send(emailData)
    .then((sent) => {
      return res.json({
        message: `Code has been sent to ${email}`,
      });
    })
    .catch((err) => {
      return res.status(400).json({
        success: false,
        errors: errorHandler(err),
      });
    });

  // return {  };

  // const {
  //   first_name,
  //   last_name,
  //   age,
  //   gender,
  //   contact_no,
  //   location,
  //   email,
  //   password,
  // } = req.body;

  // try {
  //   let data = await User.find({ role: "subscriber" });
  //   res.json(data);
  // } catch (error) {
  //   console.log(error);
  //   res.status(500).send("Server error");
  // }
};
