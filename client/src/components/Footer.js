import React, { useState } from "react";

import ModalLogin from "./ModalLogin";

function Footer() {
  const [showModal, setShowModal] = useState(false);
  return (
    <footer className="bottom-0 bg-[#5dcfff] flex justify-between p-4 md:p-10 h-[122px] ">
      <span className="text-white self-center text-xl md:text-[39px] 2xl:text-[20px] w-full">
        <a className="cursor-pointer" onClick={() => setShowModal(!showModal)}>
          Access Exclusive Site
        </a>
      </span>
      <ul className="flex self-center space-x-5 justify-end w-full"></ul>
      {showModal ? (
        <ModalLogin
          showModal={showModal}
          admin={true}
          setShowModal={setShowModal}
        />
      ) : (
        ""
      )}
    </footer>
  );
}

export default Footer;
