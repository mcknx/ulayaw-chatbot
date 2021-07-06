import React from "react";
import { Link } from "react-router-dom";

const Header = () => (
  <nav className="border-2 border-black flex justify-center p-4 md:p-10">
    <span className="self-center text-xl md:text-2xl w-40 ">
      <Link to={"/"}>IT courses</Link>
    </span>
    <ul className="flex self-center space-x-5 justify-end w-full">
      <li className="hover:underline transform hover:scale-110 hover:text-red">
        <Link to={"/shop"}>Shop</Link>
      </li>
      <li className="hover:underline transform hover:scale-110 hover:text-red">
        <Link to={"/about"}>About us</Link>
      </li>
    </ul>
  </nav>
);

export default Header;
