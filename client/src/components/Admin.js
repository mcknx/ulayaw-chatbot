import React, { useState, useEffect, useContext } from "react";
import { ShowAdminRoute } from "../Context/ShowAdminRoute";
import { GetInterpretationsContext } from "../Context/GetInterpretationsContext";
import authSvg from "../assets/forget.svg";
import ulayaw from "../assets/ulayaw.png";
import { ToastContainer, toast } from "react-toastify";
import { authenticate, isAuth } from "../helpers/auth";
import axios from "axios";
import jwt from "jsonwebtoken";
import Select from "react-select";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const Admin = ({ match }) => {
  const { showAdminRoute, setShowAdminRoute } = useContext(ShowAdminRoute);
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
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [showTD, setShowTD] = useState(false);
  const [showCreateCode, setShowCreateCode] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState();
  const [selectedUser, setSelectedUser] = useState();

  useEffect(() => {
    toast.success(`Welcome Admin!`);
    toast.success(isAuth().email);
  }, []);
  useEffect(() => {
    axios
      .get(`/api/admin/all`)
      .then((res) => {
        console.log(res);
        setUsers(res.data);
        setIsLoaded(true);
      })
      .catch((err) => {
        // toast.error(
        //   `Something went wrong, try again. ${err.response.data.error}`
        // );
      });
    console.log(users);
  }, [isLoaded]);

  let selectedUserLocal = [];
  useEffect(() => {
    if (isLoaded) {
      users.map((user) => {
        axios
          .get(`/api/admin/${user.email}`)
          .then((res) => {
            console.log(res);
            selectedUserLocal.push(res.data[0]);
            console.log(selectedUserLocal);
            if (!isUserLoaded) {
              if (selectedUserLocal.length === users.length) {
                setIsUserLoaded(true);
                setSelectedUsers(selectedUserLocal);
              }
            }
            console.log(isUserLoaded);
          })
          .catch((err) => {});
      });
      // setSelectedUser((prevSel) => {
      //   return [...prevSel, selectedUserLocal];
      // });
    }

    // console.log(selectedUser);
  }, [isLoaded, isUserLoaded, selectedUsers]);

  // if (selectedUserLocal) {
  //   console.log(selectedUserLocal);
  //   setIsUserLoaded(true);
  // }
  // console.log(selectedUserLocal);
  // console.log(selectedUser);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      {/* {isAuth() ? <Redirect to="/" /> : null} */}
      <ToastContainer />
      <div className="max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1 w-full">
        <div className="flex flex-col justify-center w-full h-full m-0 ">
          {/* table */}
          <div className="w-full h-full my-auto max-w-[1400px] max-h-[1000px] mx-auto bg-white shadow-lg rounded-sm border border-gray-200">
            <header className="px-5  border-b border-gray-100 flex justify-between">
              <h2 className="py-4 font-semibold text-gray-800">Users</h2>

              <div className=" flex items-center ">
                <h2
                  className="py-4 px-8 font-semibold text-gray-800 hover:bg-[#5dcfff] cursor-pointer rounded-lg p-1 hover:text-white hover:shadow-lg"
                  // onClick={() => toast.success("Successfully Created Code!")}
                  onClick={() => setShowCreateCode(true)}
                >
                  Create Code
                </h2>
                <div className="px-8 space-x-2 border-l-2 flex items-center">
                  <h2
                    onClick={() => {
                      setShowAdminRoute(false);
                      cookies.remove("adminLogged", { path: "/" });
                      window.location.reload();
                      // cookies.set("adminLogged", false, { path: "/" });
                      // console.log(!cookies.get("adminLogged"));

                      // window.location.reload();
                    }}
                    className="font-semibold text-gray-800 cursor-pointer"
                  >
                    <Link to={"/feedback"}>Logout</Link>
                  </h2>
                  {/* <div className="w-10 h-10 flex-shrink-0 mr-2 sm:mr-3">
                    <img
                      className="rounded-full"
                      src={ulayaw}
                      width="40"
                      height="40"
                      alt="Alex Shatov"
                    />
                  </div> */}
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
                          ABC Thought Diary
                        </div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-center">Details</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-100">
                    {isLoaded ? (
                      users.map((user, y) => {
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
                              {isUserLoaded && selectedUsers != undefined ? (
                                <>
                                  {/* {selectedUsers[y] != undefined ? (
                                    <>
                                      {selectedUsers[y].user_email ===
                                      user.email ? (
                                        <>
                                          {selectedUsers[y].result === "low" ? (
                                            <div className="text-left font-medium text-green-500">
                                              Low Risk
                                            </div>
                                          ) : (
                                            <>
                                              {selectedUsers[y].result ===
                                              "high" ? (
                                                <div className="text-left font-medium text-red-500">
                                                  High Risk
                                                </div>
                                              ) : (
                                                <div className="text-left font-medium">
                                                  Not claimed
                                                </div>
                                              )}
                                            </>
                                          )}
                                        </>
                                      ) : (
                                        <div className="text-left font-medium">
                                          No Data
                                        </div>
                                      )}
                                    </>
                                  ) : (
                                    <div className="text-left font-medium">
                                      No data
                                    </div>
                                  )} */}
                                  {selectedUsers.map((s, i) => {
                                    console.log(s);
                                    if (s != undefined) {
                                      if (s.user_email === user.email) {
                                        if (s.result === "low") {
                                          return (
                                            <div className="text-left font-medium text-green-500">
                                              Low Risk
                                            </div>
                                          );
                                        } else if (s.result === "high") {
                                          return (
                                            <div className="text-left font-medium text-red-500">
                                              High Risk
                                            </div>
                                          );
                                        } else if (s.result === "0") {
                                          return (
                                            <div className="text-left font-medium ">
                                              Not Claimed
                                            </div>
                                          );
                                        }
                                      }
                                    }
                                  })}
                                </>
                              ) : (
                                <div className="text-left font-medium">
                                  Loading...
                                </div>
                              )}
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              <div
                                className="mx-auto text-center hover:opacity-80 bg-[#5dcfff] cursor-pointer w-[50px] rounded-lg p-1 text-white hover:shadow-lg"
                                onClick={() => {
                                  setShowTD(true);
                                  setSelectedUser(user);
                                }}
                              >
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
      {showTD ? (
        <ThoughtDiary
          user={selectedUser}
          setShowModal={setShowTD}
          showModal={showTD}
        />
      ) : (
        ""
      )}
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
  const options = [
    { value: "masma_180000002118@uic.edu.ph", label: "Mckeen Asma" },
    { value: "ebayacag_180000002988@uic.edu.ph", label: "Eldon Bayacag" },
    { value: "jsurigao_180000002050@uic.edu.ph", label: "Jonash Surigao" },
    { value: "ctalo_180000001941@uic.edu.ph", label: "Christian John Talo" },
  ];
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    age: "",
    gender: "male",
    contact_no: "",
    location: { lat: "", lng: "" },
    email: "",
    admin_email: "",
    r_email: "",
    result: "",
    cfirst_name: "",
    clast_name: "",
    ccontact_no: "",
    textChange: "Sign Up",
  });
  const [selectedOptions, setSelectedOptions] = useState([]);

  const { r_email } = formData;
  // const handleChange = (text, val) => (e) => {
  //   setFormData({ ...formData, [text]: e.target.value });
  //   console.log(e.target.value);
  // };
  const handleChange = (options) => {
    // setSelectedOptions(options);
    setFormData({ ...formData, r_email: options.value });

    // console.log(options);
  };
  async function handleSubmit(e) {
    e.preventDefault();

    if (r_email) {
      console.log(formData);
      // console.log("success here", formData);

      // console.log("success here");
      // setFormData({ ...formData, textChange: "Submitting" });
      await axios
        .post(`/api/admin/handOver`, {
          r_email,
          formData,
        })
        .then((res) => {
          // console.log(res);
          if (res.data.errors) {
            toast.error(res.data.errors);
          } else {
            toast.success("Patient handover successful! check email.");
            // toast.success(res.data.message);
            console.log(res);
          }
        })
        .catch((err) => {
          toast.error(err.response.data.errors);
        });

      console.log(formData);
    }
  }
  useEffect(async () => {
    await axios
      .get(`/api/admin/${props.user.email}`)
      .then((res) => {
        console.log(res);

        setSelectedUser(res.data[0]);
        setFormData({
          ...formData,
          first_name: props.user.first_name,
          last_name: props.user.last_name,
          gender: props.user.gender,
          location: {
            lat: props.user.location.lat,
            lng: props.user.location.lng,
          },
          age: props.user.age,
          email: props.user.email,
          contact_no: props.user.contact_no,
          admin_email: res.data[0].admin_email,
          code: res.data[0].code,
          result: res.data[0].result,
          cfirst_name: res.data[0].companion.companion_first_name,
          clast_name: res.data[0].companion.companion_last_name,
          ccontact_no: res.data[0].companion.companion_contact_no,
        });
        setIsLoaded(true);
      })
      .catch((err) => {});
  }, [isLoaded]);
  // if (isLoaded) console.log(selectedUser);
  return (
    <>
      <div className="left-0 fixed top-0 w-full h-full bg-black bg-opacity-[0.75] ">
        <ToastContainer />
        <div className="h-full flex flex-col  justify-center align-center ">
          {/* header */}
          <div className="w-full top-[60px] md:top-[70px] h-[129.5px] md:w-[600px] rounded-t-[10px] text-[25px] lg:text-[35px] p-[18px] lg:p-[28px]  text-white self-center bg-[#5DCFFF] font-semibold text-center relative">
            <button
              className=" text-white md:px-[13px] md:py-[8px] py-[4px] absolute top-4  md:right-4 right-2 md:w-[70px] w-[35px] rounded-[5px] bg-[#2E93BE] text-[10px] md:text-[14px]"
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
          <div className=" w-full h-full  2xl:h-[800px] md:w-[600px] rounded-b-[10px] text-[12px] lg:text-[16px] p-[18px] md:px-[71px] py-[55px] self-center bg-white justify-center flex flex-col ">
            {/* inputs */}
            <span className="overflow-y-auto mt-[60px]">
              <>
                {/* first name */}
                <label>Select Receiver Email</label>
                <label className="space-x-[10px]  text-gray-600 inline-block p-4  rounded-lg  select-none w-full ">
                  {/* <input
                    className=" focus:ring-1 focus:ring-[#5DCFFF] p-4 outline-none w-full rounded-[15px]  bg-[#F2F3F7]"
                    type="text"
                    placeholder="DR.JOSE RIZAL"
                    disabled
                    // onChange={handleChange("first_name")}
                    // value={first_name}
                  /> */}
                  <Select
                    className=" focus:ring-1 focus:ring-[#5DCFFF] p-4 outline-none w-full rounded-[15px]  bg-[#F2F3F7]"
                    options={options}
                    // onChange={handleChange("email")}
                    onChange={handleChange}
                  />
                </label>
                {/* last name */}
                <label>Sender Email</label>
                <label className="space-x-[10px]  text-gray-600 inline-block p-4  rounded-lg  select-none w-full ">
                  <input
                    className=" focus:ring-1 focus:ring-[#5DCFFF] p-4 outline-none w-full rounded-[15px]  bg-[#F2F3F7]"
                    type="text"
                    placeholder={isAuth().email}
                    value={isAuth().email}
                    disabled
                    // onChange={handleChange("last_name")}
                    // value={last_name}
                  />
                </label>
                {isLoaded ? (
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
                    {selectedUser != undefined ? (
                      <>
                        <label>Code: {selectedUser.code}</label>

                        <label>Result: {selectedUser.result}</label>
                        <label>
                          Companion Name:{" "}
                          {selectedUser.companion.companion_first_name} {` `}{" "}
                          {selectedUser.companion.companion_last_name}
                        </label>
                        <label>
                          Companion Contact Number:{" "}
                          {selectedUser.companion.companion_contact_no}
                        </label>
                      </>
                    ) : (
                      <>
                        <label>Code: No Data</label>

                        <label>Result: No Data</label>
                        <label>Companion Name: No Data</label>
                        <label>Companion Contact Number: No Data</label>
                      </>
                    )}
                  </span>
                ) : (
                  "Loading .... "
                )}
              </>
            </span>

            {/* submit btn */}
            {selectedUser != undefined ? (
              <>
                {selectedUser.result != "0" ? (
                  <button
                    className="self-center rounded-[38px] bg-[#5DCFFF] space-x-[10px]  m-8 py-[20px] w-[405px] text-white text-[24px]"
                    onClick={(e) => {
                      // if (showRegister) {
                      handleSubmit(e);
                      // }
                    }}
                  >
                    SUBMIT
                  </button>
                ) : (
                  ""
                )}
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function CreateCode(props) {
  const [isClicked, setIsClicked] = useState(false);
  const [formData, setFormData] = useState({
    admin_email: isAuth().email,
    email: "",
    // token: "",
    // show: true,
  });
  const [createdCode, setCreatedCode] = useState(false);
  // const [code, setCreatedCode ] = useState(false)
  const { email, admin_email } = formData;
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleChange = (text, val) => (e) => {
    // console.log(email);
    // if (e.target.value !== "") {
    setFormData({ ...formData, [text]: e.target.value });
    setIsClicked(false);
    // } else {
    //   toast.error("Field must not be empty");
    //   setIsClicked(false);
    // }
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (email) {
      // console.log("success here", formData);

      console.log("success here");
      setFormData({ ...formData, textChange: "Submitting" });
      await axios
        .post(`/api/admin/createCode`, {
          email,
          admin_email,
        })
        .then((res) => {
          // console.log(res);
          if (res.data.errors) {
            setIsClicked(false);
            toast.error(res.data.errors);
          } else {
            toast.success("Created the code! check email.");
            toast.success(res.data.message);
            setCreatedCode(res.data.code);
            console.log(res);
          }
        })
        .catch((err) => {
          // setFormData({
          //   ...formData,

          //   email: "",
          // });

          // console.log(err.response);
          toast.error(err.response.data.errors);
          setIsClicked(false);
          // return setIsClicked(err.data.showBtn);
        });

      console.log(formData);
    }
  }
  return (
    <>
      <div className="left-0 fixed top-0 w-full h-full bg-black bg-opacity-[0.75] ">
        <ToastContainer />
        <div className="h-full flex flex-col  justify-center align-center">
          {/* header */}
          <div className="w-full md:h-[129.5px] md:w-[600px] mx-auto rounded-t-[10px] text-[25px] lg:text-[35px] p-[18px] lg:p-[28px]  text-white self-center bg-[#5DCFFF] font-semibold text-center relative">
            <button
              className=" text-white md:px-[13px] md:py-[8px] py-[4px] absolute top-4  md:right-4 right-2 md:w-[70px] w-[35px] rounded-[5px] bg-[#2E93BE] text-[10px] md:text-[14px]"
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
          <div className="w-full h-full md:h-[362px] md:w-[600px] mx-auto rounded-b-[10px] text-[12px] lg:text-[16px] p-[18px] md:px-[71px] py-[55px] self-center bg-white justify-center flex flex-col ">
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
                className="self-center rounded-[38px] bg-[#5DCFFF] space-x-[10px]  m-8 py-[20px] w-[405px] text-white text-[24px] disabled:opacity-20 disabled:cursor-default"
                onClick={(e) => {
                  // if (showRegister) {
                  handleSubmit(e);
                  setIsClicked(!isClicked);
                  // }
                }}
                // onChange={setIsClicked(!isClicked)}
                disabled={isClicked}
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

function ThoughtDiary(props) {
  const { getInterpretations, setGetInterpretations } = useContext(
    GetInterpretationsContext
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  let presentEmotion;
  let step1ActivatingEvents;
  let step1SelectedAE;
  let step2Other;
  let step3Hot;
  let step3Rate;
  let step4Thoughts;
  let step5AfterFeelings;

  // console.log(props.user.email);
  useEffect(async () => {
    await axios
      .get(`/api/admin/thoughtDiaryAdmin/${props.user.email}`)
      .then((res) => {
        console.log(res);
        setSelectedUser(res.data.formData);
        // presentEmotion = res.data.formData.presentEmotion;
        // step1ActivatingEvents = res.data.formData.step1ActivatingEvents;
        // step1SelectedAE = res.data.formData.step1SelectedAE;
        // step2Other = res.data.formData.step2Other;
        // step3Hot = res.data.formData.step3Hot[0];
        // step3Rate = res.data.formData.step3Rate;
        // step4Thoughts = res.data.formData.step4Thoughts;
        // step5AfterFeelings = res.data.formData.step5AfterFeelings;
        setIsLoaded(true);
      })
      .catch((err) => {});
  }, [isLoaded]);
  console.log(selectedUser);
  function _handleMoodResultGetOtherEmotionAll(item, i) {
    if (item) {
      return item;
    }
  }
  return (
    <div className="overflow-auto left-0 fixed top-0 w-full h-full bg-black bg-opacity-[0.75]">
      <div className="left-0 top-0  w-full h-full  bg-opacity-[0.60] z-20 mb-6">
        <div className=" w-full items-start flex md:justify-center flex-col  xl:w-[1350px] xl:pl-[24px] pt-[26px] h-[3000px] md:h-[1000px]  transform scale-[0.95] md:scale-[1.0]  ">
          {/* header */}
          <div>
            <div className="w-full md:w-[655px] h-[54px] rounded-t-[15px] text-[20px] lg:text-[24px] p-[18px] lg:pt-[11px] px-[23px] text-white self-center bg-[#49c3f7] font-bold text-center">
              <p>Thought Diary</p>
            </div>
            <button
              className=" text-white md:px-[13px] md:py-[8px] py-[4px] absolute top-4  md:right-4 right-2 md:w-[70px] w-[35px] rounded-[5px] bg-[#2E93BE] text-[10px] md:text-[14px]"
              onClick={() => {
                props.setShowModal(!props.showModal);
              }}
            >
              Close
            </button>
          </div>

          {/* body */}
          {/* bg-black bg-opacity-[0.75] text-opacity-0  */}
          <div
            className={
              "w-full md:w-[655px] rounded-b-[15px] self-start  grid grid-cols-1 md:grid-cols-2  h-[1500px] md:min-h-[750px] text-[#4CC2F4] text-[20px] font-semibold bg-white"
            }
          >
            {/* A and C */}
            <div className="w-[327.5px] border-l-4 border-b-4 md:border-r-0 border-r-4 border-t-4 border-[#86A1AC] rounded-b-[15px]  grid grid-rows-6 max-h-[750px]">
              {/* section 1 */}
              <div
                className={
                  "border-b-4 border-[#86A1AC] row-span-3 rounded-[15px]"
                }
              >
                <div className=" p-4 break-words ">
                  <label className="text-[20px] ">A) Activating Event</label>
                  <div className="flex flex-col leading-none  text-[32px] text-center ">
                    <label
                      className="max-w-[300px] max-h-[250px]
                    text-[16px]"
                    >
                      {/* Crying out loud last week */}
                      {/* {getAdverseStep3} */}
                      {isLoaded ? selectedUser.step1SelectedAE : "Loading..."}
                    </label>
                  </div>
                </div>
              </div>
              {/* section 2 */}
              <div className={" p-4 row-span-3 rounded-[15px]"}>
                <label className="text-[20px] ">C) Consequences</label>
                <div className=" text-center break-words max-w-[300px]">
                  {/* Present emotion section */}
                  <label className="flex flex-col leading-none">
                    <label>
                      <label className="text-[14px] text-blue-900  font-bold">
                        present emotion
                      </label>
                    </label>

                    <label className="">
                      {isLoaded ? selectedUser.presentEmotion : "Loading..."}
                      <span className="text-[50px] leading-[0px]">.</span>
                      {/* {count === 1 ? (
                      <span className="text-[50px] leading-[0px]">.</span>
                    ) : (
                      ""
                    )} */}

                      {/* Sad<span className="text-[50px] leading-[0px]">,</span> Low
                    feeling<span className="text-[50px] leading-[0px]">.</span> */}
                    </label>
                  </label>

                  {/* Hot emotion section */}
                  <label className="flex flex-col leading-none">
                    <label>
                      <label className="text-[14px] text-blue-900  font-bold">
                        hot emotion: rated{" "}
                        {isLoaded ? selectedUser.step3Rate : "Loading..."}/100
                      </label>
                    </label>
                    {/* <label className="text-[14px] text-blue-900  font-bold">
                    hot emotion: rated {getHotEmotionRate}/10
                  </label> */}
                    <label className="">
                      {isLoaded ? selectedUser.step3Hot[0] : "Loading..."}
                      <span className="text-[50px] leading-[0px]">.</span>
                      {/* {count === 1 ? (
                      <span className="text-[50px] leading-[0px]">.</span>
                    ) : (
                      ""
                    )} */}

                      {/* Sad<span className="text-[50px] leading-[0px]">,</span> Low
                    feeling<span className="text-[50px] leading-[0px]">.</span> */}
                    </label>
                  </label>

                  {/* Other emotions section */}
                  <label className="pt-10 flex flex-col leading-none">
                    <label>
                      <label className="text-[14px] text-blue-900  font-bold">
                        other emotions you feel
                      </label>
                    </label>

                    <label className="">
                      {isLoaded
                        ? selectedUser.step2Other.map((item, i) => {
                            return (
                              <>
                                {i != 0 ? (
                                  <span className="text-[50px] leading-[0px]">
                                    ,
                                  </span>
                                ) : (
                                  ""
                                )}
                                {_handleMoodResultGetOtherEmotionAll(item, i)}
                              </>
                            );
                          })
                        : "Loading..."}
                      <span className="text-[50px] leading-[0px]">.</span>
                    </label>
                  </label>
                </div>
              </div>
            </div>
            {/* B */}
            <div className="w-[327.5px] rounded-b-[15px] border-l-4 border-r-4 border-b-4 border-t-4 border-[#86A1AC] grid grid-rows-6 ">
              {/* section 1 */}
              <div
                className={
                  "pb-4 p-4 row-span-4 border-b-4 border-[#86A1AC] max-h-[750px]"
                }
              >
                <label className="text-[20px] ">B) Beliefs</label>
                <div className="text-center break-words max-w-[290px]">
                  {/* hot thought */}
                  {/* {continueThoughtDiary ? ( */}
                  <label className="flex flex-col leading-none">
                    <label>
                      {/* <label className="text-[14px] text-blue-900  font-bold">
                          the hot thought: rated {getHotThoughtRate}/100
                        </label> */}
                    </label>

                    {/* <label className=""> */}
                    {/* {getHotThoughtB[0]} */}
                    {/* I'm always going to feel depressed
                    <span className="text-[50px] leading-[0px]">.</span> */}
                    {/* </label> */}
                  </label>
                  {/* ) : (
                    ""
                  )} */}

                  {/* other thoughts */}
                  <label className="flex flex-col leading-none pt-10">
                    <label className="text-[14px] text-blue-900  font-bold">
                      thoughts of the event
                    </label>

                    {/* other thoughts instances */}
                    <div className="leading-normal flex flex-col w-full">
                      <label className="">
                        {isLoaded
                          ? selectedUser.step4Thoughts.map((item, i) => {
                              return (
                                <>
                                  {i != 0 ? (
                                    <span className="text-[50px] leading-[0px]">
                                      ,
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                  {item}
                                </>
                              );
                            })
                          : "Loading..."}

                        <span className="text-[50px] leading-[0px]">.</span>
                      </label>
                    </div>
                  </label>
                </div>
              </div>

              {/* section 2 */}

              <div
                className={
                  " text-center break-words max-w-[330px]  pt-2 pb-4 px-4 row-span-2"
                }
              >
                <label className="flex flex-col leading-none">
                  <label>
                    <label className="text-[14px] text-blue-900  font-bold">
                      interpretation(s)
                    </label>
                  </label>
                </label>
                <label className="">
                  {/* {_handleShowList(getOtherThoughtB)} */}
                  {isLoaded
                    ? selectedUser.step5AfterFeelings.map((item, i) => {
                        // console.log(firstHit === -1, firstHit);
                        // if (item.select && firstHitOther === -1) {
                        //   firstHitOther = i;
                        // }
                        return (
                          <>
                            {/* .select && i != firstHitOther */}
                            {i != 0 ? (
                              <span className="text-[50px] leading-[0px]">
                                ,
                              </span>
                            ) : (
                              ""
                            )}
                            {item}
                          </>
                        );
                      })
                    : ""}
                  <span className="text-[50px] leading-[0px]">.</span>
                </label>
                {/* The hot thought Unhelpful Thinking Styles */}

                {/* Other Unhelpful Thinking Styles  */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Admin;
