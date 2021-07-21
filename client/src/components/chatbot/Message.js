import React from "react";

function Message({ speaks, text }) {
  // console.log(speaks);
  return (
    <div className="border-2 border-black rounded-lg  mb-2">
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
          ? "flex justify-start space-x-2 bg-blue-100 p-2 rounded-lg"
          : "flex flex-row-reverse space-x-2 space-x-reverse bg-red-100 p-2 rounded-lg"
      }
    >
      <div className="bg-red-500 rounded-full p-2 text-white self-center h-10 w-10 ">
        <a href="/">{speaks}</a>
      </div>

      <div className="self-center">
        <span>{text}</span>
      </div>
    </div>
  );
}

export default Message;
