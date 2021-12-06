const User = require("../models/auth.model");
const { validationResult } = require("express-validator");
const Code = require("../models/code.model");
const sgMail = require("@sendgrid/mail");
const config = require("../config/keys");
const _ = require("lodash");
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
exports.fetchUserCodeController = async (req, res) => {
  const email = req.params.email;
  try {
    let data = await Code.find({ user_email: email });
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};

exports.handOverController = async (req, res) => {
  const {
    formData,
    // code,
    // companion,
  } = req.body;
  console.log(formData);
  const emailData = {
    from: formData.admin_email,
    to: formData.r_email,
    subject: "HandOver Patient from Ulayaw",
    html: `
        <h1>This is the patient details.</h1>
        <p>Name: ${formData.first_name} ${formData.last_name}</p>
        <p>Gender: ${formData.gender} </p>
        <p>Location: ${formData.location.lat} ${formData.location.lng}</p>
        <p>Age: ${formData.age} </p>
        <p>Email Address: ${formData.email} </p>
        <p>Contact Number: ${formData.contact_no} </p>
        <p>Code: ${formData.code} </p>
        <p>Result: ${formData.result} </p>
        <p>Companion Name: ${formData.cfirst_name} ${formData.clast_name}</p>
        <p>Companion Contact Number: ${formData.ccontact_no}</p>

        <p>Thank you! visit us here on</p>
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
        message: `Patient Details has been sent to ${formData.r_email}`,
      });
    })
    .catch((err) => {
      return res.status(400).json({
        success: false,
        errors: err,
      });
    });
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
    admin_email,
    email,
    // code,
    // companion,
  } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors.array().map((error) => error.msg)[0]);
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
  } else {
    Code.findOne(
      {
        user_email: email,
      },
      async (err, user) => {
        if (user) {
          console.log(user);
          return res.json({
            errors: `Email already have code "${user.code}"`,
            showBtn: true,
          });
        }
        if (!user) {
          // Find if admin exist
          let admin_id;
          let admin_first_name = "";
          let admin_last_name = "";
          let admin_contact_no = "";
          await User.findOne({ email: admin_email }, (err1, admin1) => {
            // console.log(admin1, "admin1");
            if (admin1) {
              if (admin1.role === "admin") {
                admin_id = true;
              }
            }
          });

          // Find if user exist
          let user_id;
          await User.findOne({ email: email }, (err1, user1) => {
            // console.log(user1, "user1");
            if (user1) {
              if (user1.role === "subscriber") {
                user_id = true;
              }
              // user_id = true;
            }
          });

          // Find if Code Already Exist
          let count = 0;
          let uniqueCode;

          for (let i = -1; i <= count; i++) {
            await Code.findOne(
              {
                code: uniqueCode,
              },
              (err1, code1) => {
                uniqueCode = codes[count];
                if (code1) {
                  console.log(uniqueCode);
                  count += 1;
                }
              }
            );
          }

          // let companion = {};
          let result = 0;

          // console.log(
          //   admin_id,
          //   "admin_id",
          //   user_id,
          //   "user_id",
          //   admin_first_name,
          //   admin_last_name,
          //   "admin_last_name",
          //   admin_contact_no,
          //   admin_email,
          //   "admin_email",
          //   email,
          //   "user_email",
          //   uniqueCode,
          //   companion,
          //   result
          // );

          const newCode = new Code({
            admin_id,
            user_id,
            admin_first_name: admin_first_name,
            admin_last_name: admin_last_name,
            admin_contact_no: admin_contact_no,
            admin_email: admin_email,
            user_email: email,
            code: uniqueCode,
            companion: {
              companion_first_name: "",
              companion_last_name: "",
              companion_contact_no: "",
            },
            result: result,
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
        }
      }
    );
  }
};

exports.claimCodeController = async (req, res) => {
  const { input, email } = req.body;
  // console.log(input, "input", email, "email");
  Code.findOne(
    {
      user_email: email,
      code: input,
    },
    (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          errors: `Code is not correct.`,
        });
      }
      return res.json({
        success: true,
        user: user,
        message: `Successfully activated the code. ${user.code}`,
      });
    }
  );
};

exports.addCompanionController = async (req, res) => {
  const {
    assessmentTaker,
    companion_first_name,
    companion_last_name,
    companion_contact_no,
  } = req.body;
  console.log(assessmentTaker, "assessmentTaker");
  Code.findOne(
    {
      user_email: assessmentTaker.user_email,
      code: assessmentTaker.code,
    },
    (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          errors: `Updating code '${user.code}' details unsuccessful.`,
        });
      }
      const updatedFields = {
        result: assessmentTaker.result,
        companion: {
          companion_first_name: companion_first_name,
          companion_last_name: companion_last_name,
          companion_contact_no: companion_contact_no,
        },
      };
      user = _.extend(user, updatedFields);
      user.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: `Updating code '${user.code}' details unsuccessful.`,
          });
        }
      });
      return res.json({
        success: true,
        user: user,
        message: `Successfully updated code '${user.code}' details. `,
      });
    }
  );
};
