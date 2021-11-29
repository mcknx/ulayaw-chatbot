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

  //   const {
  //     first_name,
  //     last_name,
  //     age,
  //     gender,
  //     contact_no,
  //     location,
  //     email,
  //     password1,
  //     password2,
  //   } = users;
  useEffect(() => {
    // fetch("/api/fetchUsers")
    //   .then((res) => {
    //     if (res.ok) {
    //       return res.json();
    //     }
    //   })
    //   //   setUsers(jsonRes)
    //   .then((jsonRes) => console.log(jsonRes))
    //   .catch((err) => console.log(err));
    axios
      .get(`/api/all`)
      .then((res) => {
        console.log(res);
        res.data.map((user) => {
          setUsers((prevUser) => {
            return [
              ...prevUser,
              {
                first_name: user.first_name,
                last_name: user.last_name,
                age: user.age,
                gender: user.gender,
                contact_no: user.contact_no,
                gender: user.gender,
                contact_no: user.contact_no,
                location: user.location,
                email: user.email,
                createdAt: user.createdAt,
              },
            ];
          });
        });

        // toast.success(res.data.message);
      })
      .catch((err) => {
        // toast.error(
        //   `Something went wrong, try again. ${err.response.data.error}`
        // );
      });
    console.log(users);
  }, []);

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
                <h2 className="py-4 px-8 font-semibold text-gray-800 hover:bg-[#5dcfff] cursor-pointer rounded-lg p-1 hover:text-white hover:shadow-lg" onClick={() => toast.success("Successfully Created Code!")}>
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
                    <tr>
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
                            Mr.Sherlock Ulayaw Holmes
                          </div>
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-left">alexshatov@gmail.com</div>
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
                        <div className="mx-auto text-center hover:opacity-80 bg-[#5dcfff] cursor-pointer w-[50px] rounded-lg p-1 text-white hover:shadow-lg" >
                          show
                        </div>
                      </td>
                    </tr>
                    <tr>
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
                            Mr.Sherlock Ulayaw Holmes
                          </div>
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-left">alexshatov@gmail.com</div>
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
                        <div className="mx-auto text-center hover:opacity-80 bg-[#5dcfff] cursor-pointer w-[50px] rounded-lg p-1 text-white hover:shadow-lg" >
                          show
                        </div>
                      </td>
                    </tr>
                    <tr>
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
                            Mr.Sherlock Ulayaw Holmes
                          </div>
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-left">alexshatov@gmail.com</div>
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
                        <div className="mx-auto text-center hover:opacity-80 bg-[#5dcfff] cursor-pointer w-[50px] rounded-lg p-1 text-white hover:shadow-lg" >
                          show
                        </div>
                      </td>
                    </tr>
                    <tr>
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
                            Mr.Sherlock Ulayaw Holmes
                          </div>
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-left">alexshatov@gmail.com</div>
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
                        <div className="mx-auto text-center hover:opacity-80 bg-[#5dcfff] cursor-pointer w-[50px] rounded-lg p-1 text-white hover:shadow-lg" >
                          show
                        </div>
                      </td>
                    </tr>
                    <tr>
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
                            Mr.Sherlock Ulayaw Holmes
                          </div>
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-left">alexshatov@gmail.com</div>
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
                        <div className="mx-auto text-center hover:opacity-80 bg-[#5dcfff] cursor-pointer w-[50px] rounded-lg p-1 text-white hover:shadow-lg" >
                          show
                        </div>
                      </td>
                    </tr>
                    <tr>
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
                            Mr.Sherlock Ulayaw Holmes
                          </div>
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-left">alexshatov@gmail.com</div>
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
                        <div className="mx-auto text-center hover:opacity-80 bg-[#5dcfff] cursor-pointer w-[50px] rounded-lg p-1 text-white hover:shadow-lg" >
                          show
                        </div>
                      </td>
                    </tr>
                    <tr>
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
                            Mr.Sherlock Ulayaw Holmes
                          </div>
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-left">alexshatov@gmail.com</div>
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
                        <div className="mx-auto text-center hover:opacity-80 bg-[#5dcfff] cursor-pointer w-[50px] rounded-lg p-1 text-white hover:shadow-lg" >
                          show
                        </div>
                      </td>
                    </tr>
                    ;
                    {/* {users.map((user) => {
                      <tr>
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
                              {user.first_name} {` `}
                              {user.last_name}
                            </div>
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-left">alexshatov@gmail.com</div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-left font-medium text-green-500">
                            $2,890.66
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="mx-auto text-center hover:opacity-80 bg-[#5dcfff] cursor-pointer w-[50px] rounded-lg p-1 text-white hover:shadow-lg">
                            show
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="mx-auto text-center hover:opacity-80 bg-[#5dcfff] cursor-pointer w-[50px] rounded-lg p-1 text-white hover:shadow-lg">
                            show
                          </div>
                        </td>
                      </tr>;
                    })} */}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      ;
    </div>
  );
};

export default Admin;
