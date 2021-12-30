const User = require("../models/auth.model");
const ThoughtDiary = require("../models/ThoughtDiary");
const { validationResult } = require("express-validator");
const Code = require("../models/code.model");
const sgMail = require("@sendgrid/mail");
const config = require("../config/keys");
const _ = require("lodash");
const opencage = require("opencage-api-client");
sgMail.setApiKey(config.mailKey);

exports.thoughtDiaryAdminController = async (req, res) => {
  const email = req.params.email;

  await ThoughtDiary.findOne(
    {
      email: email,
    },
    (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "User does not have Thought Diary yet",
        });
      } else {
        return res.json({
          formData: user,
        });
      }
    }
  );
  // console.log(email);
};

exports.thoughtDiaryController = async (req, res) => {
  const { email, formData } = req.body;
  let presentEmotion;
  formData[0].presentEmotion.map((item) => {
    if (item != null) {
      presentEmotion = item;
    }
  });
  let step1ActivatingEvents = formData[1].step1ActivatingEvents;
  let step1SelectedAE = formData[2].step1SelectedAE;
  let step2Other = formData[3].step2Other;
  let step3Hot = formData[4].step3Hot;
  let step3Rate = formData[5].step3Rate;
  let step4Thoughts = formData[6].step4Thoughts;
  let step5AfterFeelings = formData[7].step5AfterFeelings;
  console.log(formData);

  User.findOne(
    {
      email,
    },
    async (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "User with that email does not exist",
        });
      }

      await ThoughtDiary.findOne(
        {
          email: email,
        },
        (err12, userHasThoughtDiary) => {
          if (!userHasThoughtDiary) {
            console.log("User does not have thought Diary");
            const td = new ThoughtDiary({
              email: email,
              presentEmotion: presentEmotion,
              step1ActivatingEvents: step1ActivatingEvents,
              step1SelectedAE: step1SelectedAE,
              step2Other: step2Other,
              step3Hot: step3Hot,
              step3Rate: step3Rate,
              step4Thoughts: step4Thoughts,
              step5AfterFeelings: step5AfterFeelings,
            });
            td.save((error, thoughtD) => {
              if (error) {
                console.log("Save error", error);
                return res.status(401).json({
                  errors: error,
                });
              } else {
                return res.json({
                  success: true,
                  message: "new ThoughtDiary has been saved",
                });
              }
            });
          } else {
            console.log("User has thought Diary");
            const updatedFields = {
              presentEmotion: presentEmotion,
              step1ActivatingEvents: step1ActivatingEvents,
              step1SelectedAE: step1SelectedAE,
              step2Other: step2Other,
              step3Hot: step3Hot,
              step3Rate: step3Rate,
              step4Thoughts: step4Thoughts,
              step5AfterFeelings: step5AfterFeelings,
            };
            userHasThoughtDiary = _.extend(userHasThoughtDiary, updatedFields);

            userHasThoughtDiary.save((error, thoughtD) => {
              if (error) {
                console.log("Save error", error);
                return res.status(401).json({
                  errors: error,
                });
              } else {
                return res.json({
                  success: true,
                  message: "ThoughtDiary has been updated",
                });
              }
            });
          }
        }
      );
      console.log(user);
    }
  );

  // console.log(presentEmotion, "presentEmotion");
  // console.log(formData[1].step1ActivatingEvents, "step1ActivatingEvents");
  // console.log(formData[2].step1SelectedAE, "step1SelectedAE");
  // console.log(formData[3].step2Other, "step2Other");
  // console.log(formData[4].step3Hot[0], "step3Hot");
  // console.log(formData[5].step3Rate, "step3Rate");
  // console.log(formData[6].step4Thoughts, "step4Thoughts");
  // console.log(formData[7].step5AfterFeelings, "step5AfterFeelings");
  // console.log(email, "email");
  // console.log(formData, "formData");
};

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
  // console.log(formData);
  // console.log(`${formData.location.lng}, ${formData.location.lat}`);

  // opencage
  //   .geocode({
  //     q: `${formData.location.lat}, ${formData.location.lng}`,
  //     language: "en",
  //     key: "9cc3ec7ae0c1411ca25e2f57b759ad5f",
  //   })
  //   .then((data) => {
  //     // console.log(JSON.stringify(data));
  //     if (data.results.length > 0) {
  //       const place = data.results[0];
  //       console.log(place.formatted);
  //       console.log(place.components.road);
  //       console.log(place.annotations.timezone.name);
  //     } else {
  //       console.log("status", data.status.message);
  //       console.log("total_results", data.total_results);
  //     }
  //   })
  //   .catch((error) => {
  //     console.log("error", error.message);
  //     if (error.status.code === 402) {
  //       console.log("hit free trial daily limit");
  //       // console.log("become a customer: https://opencagedata.com/pricing");
  //     }
  //   });

  const emailData = {
    from: formData.admin_email,
    to: formData.r_email,
    subject: "HandOver Patient from Ulayaw",
    html: `
        <h1>This is the patient details.</h1>
        <p>Name: ${formData.first_name} ${formData.last_name}</p>
        <p>Gender: ${formData.gender} </p>
        <p>Location: ${formData.location.lat} ${formData.location.lng} (Please copy paste lat and lng to google)</p>
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
      const emailData = {
        from: config.emailFrom,
        to: assessmentTaker.admin_email,
        subject: "SBQR Result from Ulayaw",
        html: `
        <p>User Email: ${assessmentTaker.user_email} </p>
            <p>Result: ${assessmentTaker.result} </p>
            
    
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
            success: true,
            user: user,
            message: `Successfully updated code '${user.code}' details. `,
          });
          // return res.json({
          //   message: `Patient Details has been sent to ${formData.r_email}`,
          // });
        })
        .catch((err) => {
          return res.status(400).json({
            success: false,
            errors: err,
          });
        });
    }
  );
};
