import React from "react";

function Message({ speaks, text }) {
  console.log(speaks);
  return (
    <div className="border-2 border-black rounded-lg p-2">
      <div>
        <div className="flex space-x-2">
          {speaks === "bot" && (
            <div className="bg-gray-500 rounded-full p-2 text-white self-center">
              <a href="/">{speaks}</a>
            </div>
          )}
          <div className="self-center">
            <span>{text}</span>
          </div>
          {speaks === "user" && (
            <div>
              <a href="/">{speaks}</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Message;
