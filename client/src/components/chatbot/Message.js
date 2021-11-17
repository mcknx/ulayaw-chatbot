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
          ? "flex justify-start space-x-2  p-2 rounded-lg bottom-0  max-w-[500px]"
          : "flex flex-row-reverse space-x-2 space-x-reverse  p-2 rounded-lg max-w-[500px] break-words"
      }
    >
      <div
        className={float === "left" ? "flex justify-end flex-col" : "hidden"}
      >
        <div className=" rounded-full flex justify-center  text-white h-10 w-10  ">
          <img src="ulayaw.png" />
          {/* <a href="/">{speaks}</a> */}
        </div>
      </div>

      <div
        className={
          float === "left"
            ? "rounded-[10px] self-center overflow-ellipsis  px-4 py-2 bg-[#F2EFEF] text-black font-medium text-left"
            : "rounded-[10px] self-center overflow-ellipsis  px-4 py-2 bg-[#5DCFFF] text-white text-right"
        }
      >
        <span>{text}</span>
      </div>
    </div>
  );
}

export default Message;
