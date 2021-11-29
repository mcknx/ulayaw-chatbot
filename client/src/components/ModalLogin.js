import React, { useState } from "react";
import { GoogleLogin } from "react-google-login";
import { FaGoogle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { authenticate, isAuth } from "../helpers/auth";
import { Link, Redirect } from "react-router-dom";
import asdfjkl from "asdfjkl";
// import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input/input";

export default function ModalLogin(props) {
  const [showRegister, setShowRegister] = useState(false);
  const [selectedGender, setSelectedGender] = useState(false);
  const [value, setValue] = useState();
  let loc;
  if (props.location) {
    loc = props.location;
  } else {
    loc = "admin_loc";
  }
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    age: "",
    gender: "male",
    contact_no: "",
    location: loc,
    email: "",
    password1: "",
    password2: "",
    textChange: "Sign Up",
  });

  const {
    first_name,
    last_name,
    age,
    gender,
    contact_no,
    location,
    email,
    password1,
    password2,
  } = formData;

  const handleChange = (text, val) => (e) => {
    console.log(
      first_name,
      last_name,
      age,
      gender,
      contact_no,
      location,
      email
    );
    if (val) {
      setFormData({ ...formData, [text]: val });
    } else {
      setFormData({ ...formData, [text]: e.target.value });
    }
  };

  function handleSubmit(e) {
    e.preventDefault();
    if (props.assessment_meron_companion) {
      props.setassessment_meron_companion(false);
      props.setShowModal(false);
      toast.success("Successfully added Companion!");
    } else {
      if (showRegister) {
        // Register
        if (
          first_name &&
          last_name &&
          age &&
          gender &&
          contact_no &&
          location &&
          email &&
          password1
        ) {
          // console.log("success here", formData);

          if (password1 === password2) {
            console.log("success here");
            setFormData({ ...formData, textChange: "Submitting" });
            axios
              .post(`/api/register`, {
                first_name,
                last_name,
                age,
                gender,
                contact_no,
                location,
                email,
                password: password1,
              })
              // if (res) toast.success(res.data.message);
              // else {
              //   setFormData({
              //     ...formData,
              //     first_name: "",
              //     last_name: "",
              //     contact_no: "",
              //     location: "",
              //     age: "",
              //     gender: "",
              //     email: "",
              //     password1: "",
              //     password2: "",
              //     textChange: "Sign Up",
              //   });
              //   // console.log(err.response);
              //   toast.error(res.data.errors);
              // }
              .then((res) => {
                // setFormData({
                //   ...formData,
                //   first_name: "",
                //   last_name: "",
                //   age: "",
                //   gender: "",
                //   contact_no: "",
                //   location: "",
                //   email: "",
                //   password1: "",
                //   password2: "",
                //   textChange: "Submitted",
                // });

                toast.success(res.data.message);
              })
              .catch((err) => {
                // setFormData({
                //   ...formData,
                //   first_name: "",
                //   last_name: "",
                //   contact_no: "",
                //   location: "",
                //   age: "",
                //   gender: "",
                //   email: "",
                //   password1: "",
                //   password2: "",
                //   textChange: "Sign Up",
                // });
                console.log(err.response);
                toast.error(err.response.data.errors);
              });
            console.log(formData);
          } else {
            toast.error("Password do not match");
          }
        } else {
          toast.error("Please fill all fields");
        }
      } else {
        // Login
        if (email && password1) {
          console.log("success here");
          setFormData({ ...formData, textChange: "Submitting" });
          axios
            .post(`/api/login`, {
              email,
              password: password1,
            })
            .then((res) => {
              authenticate(res, () => {
                setFormData({
                  ...formData,
                  email: "",
                  password1: "",
                  textChange: "Submitted",
                });
                console.log(res, "sma", isAuth().role, "history");
                // isAuth() && isAuth().role === "admin"
                //   ? props.history.push("/admin")
                //   : props.history.push("/client");
                toast.success(`Hey ${res.data.user.first_name}, Welcome!`);
                props.setUserLoggedIn(res.data.user);

                props._handleTranslate(`Login`, `Login`, true);
                props._handleTranslate(
                  `We appreciate your signing in, ${res.data.user.first_name}. We've verified that you're ${res.data.user.age} years old and that you're a ${res.data.user.gender}.`,
                  `Hello ${res.data.user.first_name}, nagpapasalamat kami sa iyong pag sign in. Napag alaman namin na ikaw ay ${res.data.user.age} taong gulang at isang ${res.data.user.gender}.`
                );
                props._handleTranslate(
                  `The information will be included in your profile's documentation. You can be assured that your data will be kept confidential and secure while in our care.`,
                  `Ang mga impormasyong ito ay magiging bahagi lamang Sa dokumentasyon para sa iyong propayl. Makasisigurado po kayo na ang mga ito ay mananatiling pribado at ligtas sa aming pangangalaga.`
                );

                props._handleTranslate(
                  `Do you want to start our conversation? 😳 or you have an Assessment Code from the PMHA?`,
                  `Gusto mo na bang mag simula? 😳 o mayroon kang Assessment Code mula sa PMHA?.`
                );

                props.df_event_query("LOGIN_CONTINUE");
                props.setShowModal(false);
              });
            })
            .catch((err) => {
              setFormData({
                ...formData,
                email: "",
                password1: "",
                textChange: "Sign In",
              });
              console.log(err.response);
              toast.error(err.response.data.errors);
            });

          console.log(formData);
        } else {
          toast.error("Please fill all fields");
        }
      }
    }
  }

  const responseGoogle = (response) => {
    console.log(response);
    if (response.profileObj.email === "masma_180000002118@uic.edu.ph") {
      sendGoogleToken(response.tokenId);
    } else {
      toast.error("Admin with that email does not exist");
    }
  };

  // const responseErrorGoogle = (response) => {
  //   console.log(response);
  // };

  const sendGoogleToken = (tokenId) => {
    axios
      .post(`/api/googlelogin`, {
        idToken: tokenId,
      })
      .then((res) => {
        console.log(res.data);
        informParent(res);
      })
      .catch((error) => {
        console.log("GOOGLE SIGNIN ERROR", error.response);
        toast.error(error.response.data.error);
      });
  };
  const informParent = (response) => {
    authenticate(response, () => {
      if (isAuth() && isAuth().role === "admin") {
        // props.setShowModal(false);
        toast.success(isAuth().email);
        console.log(isAuth().email);
      } else {
        console.log("client");
      }
    });
  };
  return (
    <>
      {isAuth() ? <Redirect to="/" /> : null}
      <div className="left-0 fixed top-0 w-full h-full bg-black bg-opacity-[0.75] ">
        <ToastContainer />
        <div className="h-full flex flex-col  justify-center align-center">
          {/* header */}
          <div className="w-[600px] rounded-t-[10px] text-[25px] lg:text-[35px] p-[18px] lg:p-[28px]  text-white self-center bg-[#5DCFFF] font-semibold text-center relative">
            <button
              className=" text-white px-[13px] py-[8px] absolute top-4  right-4 lg:w-[70px] w-[60px] rounded-[5px] bg-[#2E93BE] text-[14px]"
              onClick={() => {
                props.setShowModal(!props.showModal);

                if (props.setQuickRepliesWelcome) {
                  props.setQuickRepliesWelcome(true);
                }
              }}
            >
              Close
            </button>

            {props.setQuickRepliesWelcome ? (
              <>
                {props.assessment_meron_companion ? (
                  <>
                    <p>Ulayaw Companion Details</p>
                    <p className="text-[14px] text-gray-100">
                      Please put your companion details
                    </p>
                  </>
                ) : (
                  <>
                    <p>Ulayaw Client {!showRegister ? "Login" : "Register"}</p>
                    <p className="text-[14px] text-gray-100">
                      {showRegister
                        ? "Mag register ka na ka ulayaw!"
                        : "Mag login ka na ka ulayaw!"}
                    </p>
                  </>
                )}
              </>
            ) : (
              <>
                <p>Ulayaw Exclusive {!showRegister ? "Login" : "Register"}</p>
                <p className="text-[14px] text-gray-100">
                  Accessible for Volunteers, Staffs, and Admin Only
                </p>
              </>
            )}
          </div>

          {/* body */}
          <div className="w-[600px] rounded-b-[10px] text-[12px] lg:text-[16px] p-[18px] px-[71px] py-[55px] self-center bg-white justify-center flex flex-col ">
            {/* inputs */}
            <span>
              {showRegister || props.assessment_meron_companion ? (
                <>
                  <span className="grid grid-cols-2">
                    {/* first name */}
                    <label className="space-x-[10px]  text-gray-600 inline-block p-4  rounded-lg  select-none w-full ">
                      <input
                        className=" focus:ring-1 focus:ring-[#5DCFFF] p-4 outline-none w-full rounded-[15px]  bg-[#F2F3F7]"
                        type="text"
                        placeholder="First Name"
                        onChange={handleChange("first_name")}
                        value={first_name}
                      />
                    </label>
                    {/* last name */}
                    <label className="space-x-[10px]  text-gray-600 inline-block p-4  rounded-lg  select-none w-full ">
                      <input
                        className=" focus:ring-1 focus:ring-[#5DCFFF] p-4 outline-none w-full rounded-[15px]  bg-[#F2F3F7]"
                        type="text"
                        placeholder="Last Name"
                        onChange={handleChange("last_name")}
                        value={last_name}
                      />
                    </label>
                  </span>
                  {props.assessment_meron_companion ? (
                    ""
                  ) : (
                    <span className="grid grid-cols-2">
                      {/* age */}
                      <label className="space-x-[10px]  text-gray-600 inline-block p-4  rounded-lg  select-none w-full ">
                        <input
                          className=" focus:ring-1 focus:ring-[#5DCFFF] p-4 outline-none w-full rounded-[15px]  bg-[#F2F3F7]"
                          type="number"
                          placeholder="Age"
                          onChange={handleChange("age")}
                          value={age}
                        />
                      </label>
                      {/* gender */}
                      <span className="grid grid-cols-2 space-x-2 px-4 text-center">
                        {/* male */}
                        <span className="flex items-center ">
                          <label
                            className={
                              "space-x-[10px]  text-gray-600 inline-block p-4  rounded-lg  select-none w-full hover:border-2 cursor-pointer " +
                              `${!selectedGender ? "border-2" : " "}`
                            }
                          >
                            <input
                              className=" focus:ring-1 focus:ring-[#5DCFFF] p-4 outline-none w-full rounded-[15px]  bg-[#F2F3F7] hidden"
                              type="radio"
                              name="gender"
                              onChange={handleChange("gender", "male")}
                              onClick={() => {
                                setSelectedGender(false);

                                // setGender("male");
                              }}
                              value={gender}
                            />
                            Male
                          </label>
                        </span>
                        {/* female */}
                        <span className="flex items-center">
                          <label
                            className={
                              "space-x-[10px]  text-gray-600 inline-block p-4  rounded-lg  select-none w-full hover:border-2 cursor-pointer " +
                              `${selectedGender ? "border-2" : " "}`
                            }
                          >
                            <input
                              className=" focus:ring-1 focus:ring-[#5DCFFF] p-4 outline-none w-full rounded-[15px]  bg-[#F2F3F7] hidden"
                              type="radio"
                              name="gender"
                              onChange={handleChange("gender", "female")}
                              onClick={() => {
                                setSelectedGender(true);

                                // setGender("female");
                              }}
                              value={gender}
                            />
                            Female
                          </label>
                        </span>
                      </span>
                    </span>
                  )}
                  {/* contact */}
                  <label className="space-x-[10px]  text-gray-600 inline-block p-4  rounded-lg  select-none w-full ">
                    <PhoneInput
                      country="PH"
                      international
                      withCountryCallingCode
                      className=" focus:ring-1 focus:ring-[#5DCFFF] p-4 outline-none w-full rounded-[15px]  bg-[#F2F3F7]"
                      // placeholder="Contact Number"
                      value={contact_no}
                      onChange={(phone) =>
                        setFormData({ ...formData, contact_no: phone })
                      }
                    />
                    {/* <input
                      className=" focus:ring-1 focus:ring-[#5DCFFF] p-4 outline-none w-full rounded-[15px]  bg-[#F2F3F7]"
                      type="number"
                      placeholder="Contact Number"
                      onChange={handleChange("contact_no")}
                      value={contact_no}
                    /> */}
                  </label>
                </>
              ) : (
                ""
              )}
              {props.assessment_meron_companion ? (
                ""
              ) : (
                <label className="space-x-[10px]  text-gray-600 inline-block p-4  rounded-lg  select-none w-full ">
                  {/* email */}
                  <input
                    className=" focus:ring-1 focus:ring-[#5DCFFF] p-4 outline-none w-full rounded-[15px]  bg-[#F2F3F7]"
                    type="email"
                    placeholder="Email address"
                    onChange={handleChange("email")}
                    value={email}
                  />
                </label>
              )}
              {props.assessment_meron_companion ? (
                ""
              ) : (
                <span className={showRegister ? "grid grid-cols-2" : ""}>
                  {/* password 1 */}
                  <label className="space-x-[10px]  text-gray-600 inline-block p-4  rounded-lg  select-none w-full ">
                    <input
                      className=" focus:ring-1 focus:ring-[#5DCFFF] p-4 outline-none w-full rounded-[15px]  bg-[#F2F3F7]"
                      type="password"
                      placeholder="Password"
                      onChange={handleChange("password1")}
                      value={password1}
                    />
                  </label>
                  {/* password 2 */}
                  {!showRegister ? (
                    ""
                  ) : (
                    <label className="space-x-[10px]  text-gray-600 inline-block p-4  rounded-lg  select-none w-full ">
                      <input
                        className=" focus:ring-1 focus:ring-[#5DCFFF] p-4 outline-none w-full rounded-[15px]  bg-[#F2F3F7]"
                        type="password"
                        placeholder="Confirm Password"
                        onChange={handleChange("password2")}
                        value={password2}
                      />
                    </label>
                  )}
                </span>
              )}
            </span>

            {showRegister || props.assessment_meron_companion ? (
              ""
            ) : (
              <Link
                onClick={() => props.setShowModal(false)}
                to={"/users/password/forget"}
                className="pt-4 text-[14px]  cursor-pointer  hover:text-black  text-gray-500"
              >
                Forgot password?
              </Link>
            )}

            {/* submit btn */}

            <button
              className="self-center rounded-[38px] bg-[#5DCFFF] space-x-[10px]  m-8 py-[20px] w-[405px] text-white text-[24px]"
              onClick={(e) => {
                // if (showRegister) {
                handleSubmit(e);
                // }
              }}
            >
              {props.assessment_meron_companion ? (
                "SAVE"
              ) : (
                <>{showRegister ? "REGISTER" : "LOGIN"}</>
              )}
            </button>

            {props.admin ? (
              <button
                className="self-center rounded-[38px] bg-[#5DCFFF] space-x-[10px]   py-[20px] w-[405px] text-white text-[24px]"
                // onClick={() => {
                //   setShowModal(!showModal);
                // }}
              >
                <GoogleLogin
                  clientId={process.env.REACT_APP_GOOGLE_CLIENT}
                  buttonText="Login with Google"
                  render={(renderProps) => (
                    <button
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                      className="flex justify-center w-full items-center space-x-5 h-full"
                    >
                      <span className="inline-block ">
                        <FaGoogle />
                      </span>
                      {showRegister ? (
                        <span>Register with Google</span>
                      ) : (
                        <span>Login with Google</span>
                      )}
                    </button>
                  )}
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                  cookiePolicy={"single_host_origin"}
                />
              </button>
            ) : (
              ""
            )}
            {props.admin || props.assessment_meron_companion ? (
              ""
            ) : (
              <p
                className=" pt-4 text-[14px]  cursor-pointer  hover:text-black text-center text-gray-500"
                onClick={() => setShowRegister(!showRegister)}
              >
                {showRegister
                  ? "Have an account? Click here to Login"
                  : "Don't have an account? Click here to Signup"}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
