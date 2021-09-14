import React from "react";

function Message({ speaks, text }) {
  // console.log(speaks);
  return (
    <div className=" rounded-lg  mb-2 text-sm ">
      <div>
        {speaks === "bot" && (
          <MessageFormat speaks={speaks} text={text} float={"left"} />
        )}
        {speaks === "user" && (
          <MessageFormat speaks={speaks} text={text} float={"right"} />
        )}
      </div>
    </div>
  );
}

function MessageFormat({ speaks, text, float }) {
  // console.log(float);
  return (
    <div
      className={
        float === "left"
          ? "flex justify-start space-x-2 bg-blue-100 p-2 rounded-lg bottom-0 "
          : "flex flex-row-reverse space-x-2 space-x-reverse bg-red-100 p-2 rounded-lg "
      }
    >
      <div
        className={float === "left" ? "flex justify-end flex-col" : "hidden"}
      >
        <div className=" bg-red-500 rounded-full flex justify-center  text-white h-10 w-10 ">
          <a href="/">{speaks}</a>
        </div>
      </div>

      <div className="self-center overflow-ellipsis">
        <span>{text}</span>
      </div>
    </div>
  );
}

export default Message;
