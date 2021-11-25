import React, { useState } from "react";
import { GoogleLogin } from "react-google-login";
import { FaGoogle } from "react-icons/fa";

function Footer() {
  const [showModal, setShowModal] = useState(false);
  return (
    <footer className=" bg-[#5dcfff] flex justify-between p-4 md:p-10 h-[122px] ">
      <span className="text-white self-center text-xl md:text-[39px] 2xl:text-[20px] w-full">
        <a className="cursor-pointer" onClick={() => setShowModal(!showModal)}>
          Access Exclusive Site
        </a>
      </span>
      <ul className="flex self-center space-x-5 justify-end w-full"></ul>
      {showModal ? (
        <ModalLogin showModal={showModal} setShowModal={setShowModal} />
      ) : (
        ""
      )}
    </footer>
  );
}

function ModalLogin({ showModal, setShowModal }) {
  const responseSuccessGoogle = (response) => {
    console.log(response);
  };

  const responseErrorGoogle = (response) => {
    console.log(response);
  };
  return (
    <div className="left-0 fixed top-0 w-full h-full bg-black bg-opacity-[0.75] ">
      <div className="h-full flex flex-col  justify-center align-center">
        {/* header */}
        <div className="w-[600px] rounded-t-[10px] text-[25px] lg:text-[35px] p-[18px] lg:p-[28px]  text-white self-center bg-[#5DCFFF] font-semibold text-center relative">
          <button
            className=" text-white px-[13px] py-[8px] absolute top-4  right-4 lg:w-[70px] w-[60px] rounded-[5px] bg-[#2E93BE] text-[14px]"
            onClick={() => {
              setShowModal(!showModal);
            }}
          >
            Close
          </button>

          <p>Ulayaw Exclusive</p>
          <p className="text-[14px] text-gray-100">
            Accessible for Volunteers, Staffs, and Admin Only
          </p>
        </div>

        {/* body */}
        <div className="w-[600px] rounded-b-[10px] text-[12px] lg:text-[16px] p-[18px] px-[71px] py-[55px] self-center bg-white justify-center flex flex-col ">
          {/* inputs */}
          <span>
            {/* email */}
            <label className="space-x-[10px]  text-gray-600 inline-block p-4  rounded-lg  select-none w-full ">
              <input
                className=" focus:ring-1 focus:ring-[#5DCFFF] p-4 outline-none w-full rounded-[15px]  bg-[#F2F3F7]"
                type="email"
                placeholder="Email address"
              />
            </label>
            {/* password */}
            <label className="space-x-[10px]  text-gray-600 inline-block p-4  rounded-lg  select-none w-full ">
              <input
                className=" focus:ring-1 focus:ring-[#5DCFFF] p-4 outline-none w-full rounded-[15px]  bg-[#F2F3F7]"
                type="password"
                placeholder="Password"
              />
            </label>
          </span>

          {/* <p className="text-[14px] underline cursor-pointer hover:opacity-80">
            Forgot password?
          </p> */}

          {/* submit btn */}

          <button
            className="self-center rounded-[38px] bg-[#5DCFFF] space-x-[10px]  m-8 py-[20px] w-[405px] text-white text-[24px]"
            onClick={() => {
              setShowModal(!showModal);
            }}
          >
            LOGIN
          </button>

          <button
            className="self-center rounded-[38px] bg-[#5DCFFF] space-x-[10px]   py-[20px] w-[405px] text-white text-[24px]"
            // onClick={() => {
            //   setShowModal(!showModal);
            // }}
          >
            <GoogleLogin
              clientId="776383263813-s1sb5so05k9rqk10fl9l3gtiac97cbkc.apps.googleusercontent.com"
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
                  <span>Login with Google</span>
                </button>
              )}
              onSuccess={responseSuccessGoogle}
              onFailure={responseErrorGoogle}
              cookiePolicy={"single_host_origin"}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Footer;
