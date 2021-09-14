import React from "react";
import { Link } from "react-router-dom";

const Header = () => (
  <nav className="bg-[#5dcfff] flex justify-center p-4 md:p-10">
    <span className="text-white self-center text-xl md:text-4xl w-40 ">
      <Link to={"/"}>Ulayaw</Link>
    </span>
    <ul className="flex self-center space-x-5 justify-end w-full">
      {/* <li className="hover:underline transform hover:scale-110 hover:text-red">
        <Link to={"/shop"}>Home</Link>
      </li> */}
      {/* <li className="hover:underline transform hover:scale-110 hover:text-red">
        <Link to={"/about"}>About us</Link>
      </li> */}
    </ul>
  </nav>
);

export default Header;
