import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import ulayawFace from "../assets/ulayaw.png";
import Cookies from "universal-cookie";

import { ShowClientRoute } from "../Context/ShowClientRoute";

const Header = () => {
  const cookies = new Cookies();
  const { showClientRoute, setShowClientRoute } = useContext(ShowClientRoute);
  const [showMenu, setShowMenu] = useState(true);

  return (
    <nav className="bg-[#5dcfff] flex flex-wrap lg:flex-nowrap justify-between lg:justify-center p-4 lg:p-10 py-8 lg:py-0 lg:h-[122px] ">
      <span className=" self-center flex mr-[4%]">
        <span className=" rounded-full self-center mr-[8%] bg-white cursor-pointer inline-block">
          <img className=" lg:w-20 " src={ulayawFace} />
        </span>
        <span className="text-white self-center text-xl lg:text-[39px] 2xl:text-[50px] w-40 cursor-pointer">
          <Link to={"/"}>Ulayaw</Link>
        </span>
      </span>
      <div class="self-center block lg:hidden">
        <button
          class="flex items-center px-3 py-2 border rounded text-teal-lighter border-teal-light hover:text-white hover:border-white"
          onClick={() => setShowMenu(!showMenu)}
        >
          <svg
            class="h-3 w-3"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      {showMenu ? (
        <ul className="text-center lg:text-left my-12 lg:my-0 block flex-grow lg:flex self-center space-y-2 lg:space-y-0 lg:space-x-5 justify-end w-full">
          <li className="text-white self-center text-sm lg:text-xl 2xl:text-[30px]  cursor-pointer">
            <Link to={"/manual"}>The Manual</Link>
          </li>
          <li className="text-white self-center text-sm lg:text-xl 2xl:text-[30px]  cursor-pointer">
            <Link to={"/about"}>About Us</Link>
          </li>
          <li className="text-white self-center text-sm lg:text-xl 2xl:text-[30px]  cursor-pointer">
            <Link to={"/team"}>The Team</Link>
          </li>
          <li className="text-white self-center text-sm lg:text-xl 2xl:text-[30px]  cursor-pointer">
            <Link to={"/feedback"}>Feedback</Link>
          </li>
          {cookies.get("clientLogged") || showClientRoute ? (
            <li
              className="text-white self-center text-sm lg:text-xl 2xl:text-[30px]  cursor-pointer"
              onClick={() => {
                cookies.remove("clientLogged", { path: "/" });
                setShowClientRoute(false);
                window.location.reload();
              }}
            >
              <Link to={"/feedback"}>Logout</Link>
            </li>
          ) : (
            ""
          )}
        </ul>
      ) : (
        ""
      )}
    </nav>
  );
};

export default Header;
