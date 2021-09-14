import React from "react";
import { Link } from "react-router-dom";

const Header = () => (
  <nav className="bg-[#5dcfff] flex justify-center p-4 md:p-10 h-[122px] ">
    <span className="h-[54px] p-[24px] w-[54px] self-center mr-[4%] rounded-full bg-[#C4C4C4] inline-block"></span>
    <span className="text-white self-center text-xl md:text-[39px] 2xl:text-[50px] w-40 ">
      <Link to={"/"}>Ulayaw</Link>
    </span>
    <ul className="flex self-center space-x-5 justify-end w-full">
      <li className="text-white self-center text-sm md:text-xl 2xl:text-[30px]  ">
        <Link to={"/shop"}>Solution</Link>
      </li>
      <li className="text-white self-center text-sm md:text-xl 2xl:text-[30px]  ">
        <Link to={"/shop"}>Resources</Link>
      </li>
      <li className="text-white self-center text-sm md:text-xl 2xl:text-[30px]  ">
        <Link to={"/shop"}>The Team</Link>
      </li>
      <li className="text-white self-center text-sm md:text-xl 2xl:text-[30px]  ">
        <Link to={"/shop"}>Feedback</Link>
      </li>
    </ul>
  </nav>
);

export default Header;
