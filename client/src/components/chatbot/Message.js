import React from "react";

function Message({ speaks, text }) {
  return (
    <div>
      <div>
        <div>
          {speaks === "bot" && (
            <div>
              <a href="/">{speaks}</a>
            </div>
          )}
          <div>
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
