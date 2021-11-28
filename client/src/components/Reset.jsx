import React, { useState, useEffect } from "react";
import authSvg from "../assets/reset.svg";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import jwt from "jsonwebtoken";

const Reset = ({ match }) => {
  const [formData, setFormData] = useState({
    password1: "",
    password2: "",
    token: "",
    textChange: "",
  });

  const { email, password1, password2, token, textChange } = formData;
  useEffect(() => {
    let token = match.params.token;
    // let { first_name } = jwt.decode(token);

    if (token) {
      setFormData({ ...formData, token });
    }

    // console.log(token, first_name);
  }, []);

  const handleChange = (text, val) => (e) => {
    setFormData({ ...formData, [text]: e.target.value });
  };

  function handleSubmit(e) {
    e.preventDefault();

    if (password1 === password2) {
      // console.log("success here");
      setFormData({ ...formData, textChange: "Submitting" });
      axios
        .post(`${process.env.REACT_APP_API_URL}/password/reset`, {
          newPassword: password1,
          resetPasswordLink: token,
        })
        .then((res) => {
          setFormData({
            ...formData,
            password1: "",
            password2: "",
          });
          toast.success(res.data.message);
        })
        .catch((err) => {
          toast.error(
            `Something went wrong, try again. ${err.response.data.error}`
          );
        });
    } else {
      toast.error("Password do not match");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      {/* {isAuth() ? <Redirect to="/" /> : null} */}
      <ToastContainer />
      <div className="max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">
              Reset Password
            </h1>

            <form
              className="w-full flex-1 mt-8 text-indigo-500"
              onSubmit={handleSubmit}
            >
              <div className="mx-auto max-w-xs relative ">
                <label className="space-x-[10px]  text-gray-600 inline-block   rounded-lg  select-none w-full ">
                  <input
                    className=" focus:ring-1 focus:ring-[#5DCFFF] p-4 outline-none w-full rounded-[15px]  bg-[#F2F3F7]"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange("password1")}
                    value={password1}
                  />
                </label>

                <label className="mt-5 space-x-[10px]  text-gray-600 inline-block  rounded-lg  select-none w-full ">
                  <input
                    className=" focus:ring-1 focus:ring-[#5DCFFF] p-4 outline-none w-full rounded-[15px]  bg-[#F2F3F7]"
                    type="password"
                    placeholder="Confirm Password"
                    onChange={handleChange("password2")}
                    value={password2}
                  />
                </label>
                <button
                  type="submit"
                  className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                >
                  <i className="fas fa-user-plus fa 1x w-6  -ml-2" />
                  <span className="ml-3">Submit</span>
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${authSvg})` }}
          ></div>
        </div>
      </div>
      ;
    </div>
  );
};

export default Reset;
