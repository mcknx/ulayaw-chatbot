import React, { useState, useEffect } from "react";
import authSvg from "../assets/forget.svg";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import jwt from "jsonwebtoken";

const ForgetPassword = ({ match }) => {
  const [formData, setFormData] = useState({
    email: "",
    textChange: "",
  });

  const { email, textChange } = formData;

  const handleChange = (text, val) => (e) => {
    setFormData({ ...formData, [text]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (email) {
      // console.log("success here", formData);

      console.log("success here");
      setFormData({ ...formData, textChange: "Submitting" });
      const res = await axios.post(`/api/password/forget`, {
        email,
      });
      if (res) toast.success("Please check your email.");
      else {
        setFormData({
          ...formData,

          email: "",
        });
        // console.log(err.response);
        toast.error(res.data.errors);
      }

      // });
      console.log(formData);
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
              Forget Password
            </h1>

            <form
              className="w-full flex-1 mt-8 text-indigo-500"
              onSubmit={handleSubmit}
            >
              <div className="mx-auto max-w-xs relative ">
                <label className="space-x-[10px]  text-gray-600 inline-block   rounded-lg  select-none w-full ">
                  <input
                    className=" focus:ring-1 focus:ring-[#5DCFFF] p-4 outline-none w-full rounded-[15px]  bg-[#F2F3F7]"
                    type="email"
                    placeholder="Email address"
                    onChange={handleChange("email")}
                    value={email}
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

export default ForgetPassword;
