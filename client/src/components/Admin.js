import React, { useState, useEffect } from "react";
import authSvg from "../assets/forget.svg";
import ulayaw from "../assets/ulayaw.png";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import jwt from "jsonwebtoken";

const Admin = ({ match }) => {
  const [users, setUsers] = useState([
    {
      first_name: "",
      last_name: "",
      age: "",
      gender: "male",
      contact_no: "",
      location: "",
      email: "",
      createdAt: "",
    },
  ]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [showCreateCode, setShowCreateCode] = useState(false);
  const [selectedUser, setSelectedUser] = useState([]);

  useEffect(() => {
    axios
      .get(`/api/admin/all`)
      .then((res) => {
        console.log(res);
        setUsers(res.data);
        setIsLoaded(true);
        // res.data.map((user) => {
        //   setUsers((prevUser) => {
        //     return [
        //       ...prevUser,
        //       {
        //         first_name: user.first_name,
        //         last_name: user.last_name,
        //         age: user.age,
        //         gender: user.gender,
        //         contact_no: user.contact_no,
        //         gender: user.gender,
        //         contact_no: user.contact_no,
        //         location: user.location,
        //         email: user.email,
        //         createdAt: user.createdAt,
        //       },
        //     ];
        //   });
        // });

        // toast.success(res.data.message);
      })
      .catch((err) => {
        // toast.error(
        //   `Something went wrong, try again. ${err.response.data.error}`
        // );
      });
    console.log(users);
  }, [isLoaded]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      {/* {isAuth() ? <Redirect to="/" /> : null} */}
      <ToastContainer />
      <div className="max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1 w-full">
        <div className="flex flex-col justify-center w-full h-full m-0 ">
          {/* table */}
          <div className="w-full h-full my-auto max-w-[1400px] max-h-[1000px] mx-auto bg-white shadow-lg rounded-sm border border-gray-200">
            <header className="px-5  border-b border-gray-100 flex justify-between">
              <h2 className="py-4 font-semibold text-gray-800">Clients</h2>

              <div className=" flex items-center ">
                <h2
                  className="py-4 px-8 font-semibold text-gray-800 hover:bg-[#5dcfff] cursor-pointer rounded-lg p-1 hover:text-white hover:shadow-lg"
                  // onClick={() => toast.success("Successfully Created Code!")}
                  onClick={() => setShowCreateCode(true)}
                >
                  Create Code
                </h2>
                <div className="px-8 space-x-2 border-l-2 flex items-center">
                  <h2 className="font-semibold text-gray-800">UIC Admin</h2>
                  <div className="w-10 h-10 flex-shrink-0 mr-2 sm:mr-3">
                    <img
                      className="rounded-full"
                      src={ulayaw}
                      width="40"
                      height="40"
                      alt="Alex Shatov"
                    />
                  </div>
                </div>
              </div>
            </header>
            <div className="p-3">
              <div className="overflow-x-auto">
                <table className="table-auto w-full">
                  <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                    <tr>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">Name</div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">Email</div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">
                          Assessment Result
                        </div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-center">
                          ABC Result
                        </div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-center">Details</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-100">
                    {isLoaded ? (
                      users.map((user) => {
                        return (
                          <tr>
                            {console.log(user)}
                            <td className="p-2 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10 flex-shrink-0 mr-2 sm:mr-3">
                                  <img
                                    className="rounded-full"
                                    src={ulayaw}
                                    width="40"
                                    height="40"
                                    alt="Alex Shatov"
                                  />
                                </div>
                                <div className="font-medium text-gray-800">
                                  {user.first_name} {` `} {user.last_name}
                                </div>
                              </div>
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              <div className="text-left">{user.email}</div>
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              <div className="text-left font-medium text-green-500">
                                Low Risk
                              </div>
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              <div className="mx-auto text-center hover:opacity-80 bg-[#5dcfff] cursor-pointer w-[50px] rounded-lg p-1 text-white hover:shadow-lg">
                                show
                              </div>
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              <div
                                className="mx-auto text-center hover:opacity-80 bg-[#5dcfff] cursor-pointer w-[50px] rounded-lg p-1 text-white hover:shadow-lg"
                                onClick={() => {
                                  setShowUser(true);
                                  setSelectedUser(user);
                                }}
                              >
                                show
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>Loading ... </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showUser ? (
        <GetUserDetails
          user={selectedUser}
          setShowModal={setShowUser}
          showModal={showUser}
        />
      ) : (
        ""
      )}
      {showCreateCode ? (
        <CreateCode
          // user={selectedUser}
          setShowModal={setShowCreateCode}
          showModal={showCreateCode}
        />
      ) : (
        ""
      )}
      ;
    </div>
  );
};

function GetUserDetails(props) {
  return (
    <>
      <div className="left-0 fixed top-0 w-full h-full bg-black bg-opacity-[0.75] ">
        <ToastContainer />
        <div className="h-full flex flex-col  justify-center align-center">
          {/* header */}
          <div className="w-[600px] rounded-t-[10px] text-[25px] lg:text-[35px] p-[18px] lg:p-[28px]  text-white self-center bg-[#5DCFFF] font-semibold text-center relative">
            <button
              className=" text-white px-[13px] py-[8px] absolute top-4  right-4 lg:w-[70px] w-[60px] rounded-[5px] bg-[#2E93BE] text-[14px]"
              onClick={() => {
                props.setShowModal(!props.showModal);
              }}
            >
              Close
            </button>

            <>
              <p>Handover Patient</p>
              <p className="text-[14px] text-gray-100">
                This form will handover the patient to the assigned volunteer or
                personel for following instructions when needed.
              </p>
            </>
          </div>

          {/* body */}
          <div className="w-[600px] rounded-b-[10px] text-[12px] lg:text-[16px] p-[18px] px-[71px] py-[55px] self-center bg-white justify-center flex flex-col ">
            {/* inputs */}
            <span>
              <>
                {/* first name */}
                <label>Select Receiver Email</label>
                <label className="space-x-[10px]  text-gray-600 inline-block p-4  rounded-lg  select-none w-full ">
                  <input
                    className=" focus:ring-1 focus:ring-[#5DCFFF] p-4 outline-none w-full rounded-[15px]  bg-[#F2F3F7]"
                    type="text"
                    placeholder="DR.JOSE RIZAL"
                    disabled
                    // onChange={handleChange("first_name")}
                    // value={first_name}
                  />
                </label>
                {/* last name */}
                <label>Sender Name (Your Name)</label>
                <label className="space-x-[10px]  text-gray-600 inline-block p-4  rounded-lg  select-none w-full ">
                  <input
                    className=" focus:ring-1 focus:ring-[#5DCFFF] p-4 outline-none w-full rounded-[15px]  bg-[#F2F3F7]"
                    type="text"
                    placeholder="Jonash Surigao"
                    disabled
                    // onChange={handleChange("last_name")}
                    // value={last_name}
                  />
                </label>

                <span className="   p-4  rounded-lg  w-full bg-gray-400 flex flex-col">
                  <label>
                    Name: {props.user.first_name} {props.user.last_name}
                  </label>
                  <label>Gender: {props.user.gender}</label>
                  {/* <label>Address: {props.user.location}</label> */}
                  <label>
                    Location: {props.user.location.lat}{" "}
                    {props.user.location.lng}
                  </label>
                  <label>Age: {props.user.age}</label>
                  <label>Email Address: {props.user.email}</label>
                  <label>Contact Number: {props.user.contact_no}</label>
                  <label>Code: {props.user.contact_no}</label>
                  <label>Result: {props.user.contact_no}</label>
                </span>
              </>
            </span>

            {/* submit btn */}

            <button
              className="self-center rounded-[38px] bg-[#5DCFFF] space-x-[10px]  m-8 py-[20px] w-[405px] text-white text-[24px]"
              // onClick={(e) => {
              //   // if (showRegister) {
              //   handleSubmit(e);
              //   // }
              // }}
            >
              SUBMIT
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function CreateCode(props) {
  const [formData, setFormData] = useState({
    admin_id: "1",
    admin_first_name: "Mckeen",
    admin_last_name: "Asma",
    admin_contact_no: "12345678999",
    admin_email: "mckeen@gmail.com",
    email: "",
    // token: "",
    // show: true,
  });
  const [createdCode, setCreatedCode] = useState(false);
  // const [code, setCreatedCode ] = useState(false)
  const { email, textChange } = formData;

  const handleChange = (text, val) => (e) => {
    // console.log(email);
    setFormData({ ...formData, [text]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (email) {
      // console.log("success here", formData);

      console.log("success here");
      setFormData({ ...formData, textChange: "Submitting" });
      const res = await axios.post(`/api/admin/createCode`, {
        formData,
        email,
      });
      if (res) {
        toast.success("Created the code! check email.");
        toast.success(res.data.message);
        setCreatedCode(res.data.code);
      } else {
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
    <>
      <div className="left-0 fixed top-0 w-full h-full bg-black bg-opacity-[0.75] ">
        <ToastContainer />
        <div className="h-full flex flex-col  justify-center align-center">
          {/* header */}
          <div className="w-[600px] rounded-t-[10px] text-[25px] lg:text-[35px] p-[18px] lg:p-[28px]  text-white self-center bg-[#5DCFFF] font-semibold text-center relative">
            <button
              className=" text-white px-[13px] py-[8px] absolute top-4  right-4 lg:w-[70px] w-[60px] rounded-[5px] bg-[#2E93BE] text-[14px]"
              onClick={() => {
                props.setShowModal(!props.showModal);
              }}
            >
              Close
            </button>

            <>
              <p>Create Code</p>
              <p className="text-[14px] text-gray-100">
                This form will create the SBQ-R assessment code the patient.
              </p>
            </>
          </div>

          {/* body */}
          <div className="w-[600px] rounded-b-[10px] text-[12px] lg:text-[16px] p-[18px] px-[71px] py-[55px] self-center bg-white justify-center flex flex-col ">
            {/* inputs */}
            <span>
              <>
                {/* first name */}
                <label>Enter Patient's Email</label>
                <label className="space-x-[10px]  text-gray-600 inline-block p-4  rounded-lg  select-none w-full ">
                  <input
                    className=" focus:ring-1 focus:ring-[#5DCFFF] p-4 outline-none w-full rounded-[15px]  bg-[#F2F3F7]"
                    type="text"
                    placeholder="Enter Patient Email"
                    // disabled
                    onChange={handleChange("email")}
                    // value={first_name}
                  />
                </label>
                {/* last name */}
                {createdCode ? (
                  <>
                    <label>
                      Send this code to the patient (or tell them to check them
                      email)
                    </label>
                    <label className="space-x-[10px]  text-gray-600 inline-block p-4  rounded-lg  select-none w-full ">
                      <input
                        className=" focus:ring-1 focus:ring-[#5DCFFF] p-4 outline-none w-full rounded-[15px]  bg-[#F2F3F7]"
                        type="text"
                        placeholder={`${createdCode}`}
                        disabled
                        // onChange={handleChange("last_name")}
                        // value={last_name}
                      />
                    </label>
                  </>
                ) : (
                  ""
                )}
              </>
            </span>

            {/* submit btn */}
            {!createdCode ? (
              <button
                className="self-center rounded-[38px] bg-[#5DCFFF] space-x-[10px]  m-8 py-[20px] w-[405px] text-white text-[24px]"
                onClick={(e) => {
                  // if (showRegister) {
                  handleSubmit(e);
                  // }
                }}
              >
                Generate Code
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Admin;
