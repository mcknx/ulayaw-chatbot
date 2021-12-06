import React from "react";
import { Link } from "react-router-dom";
import ulayawFace from "../assets/ulayaw.png";

const Header = () => (
  <nav className="bg-[#5dcfff] flex justify-center p-4 md:p-10 h-[122px] ">
    <span className=" self-center mr-[4%] rounded-full bg-white cursor-pointer inline-block">
      <img className=" w-20 " src={ulayawFace} />
    </span>
    <span className="text-white self-center text-xl md:text-[39px] 2xl:text-[50px] w-40 cursor-pointer">
      <Link to={"/"}>Ulayaw</Link>
    </span>
    <ul className="flex self-center space-x-5 justify-end w-full">
      <li className="text-white self-center text-sm md:text-xl 2xl:text-[30px]  cursor-pointer">
        <Link to={"/manual"}>The Manual</Link>
      </li>
      <li className="text-white self-center text-sm md:text-xl 2xl:text-[30px]  cursor-pointer">
        <Link to={"/about"}>About Us</Link>
      </li>
      <li className="text-white self-center text-sm md:text-xl 2xl:text-[30px]  cursor-pointer">
        <Link to={"/team"}>The Team</Link>
      </li>
      <li className="text-white self-center text-sm md:text-xl 2xl:text-[30px]  cursor-pointer">
        <Link to={"/feedback"}>Feedback</Link>
      </li>
    </ul>
  </nav>
);

export default Header;
