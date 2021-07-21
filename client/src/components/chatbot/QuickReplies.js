import React from "react";
import QuickReply from "./QuickReply";

function QuickReplies(props) {
  function _handleClick(event, payload, text) {
    props.replyClick(event, payload, text);
  }

  function renderQuickReply(reply, i) {
    return <QuickReply key={i} click={_handleClick} reply={reply} />;
  }

  function renderQuickReplies(quickReplies) {
    if (quickReplies) {
      return quickReplies.map((reply, i) => {
        return renderQuickReply(reply, i);
      });
    } else {
      return null;
    }
  }

  return (
    <div className="border-2 border-black rounded-lg bg-blue-100 p-2 mb-2">
      <div className="py-2">
        <div className="flex space-x-2 space-y-5 flex-wrap">
          <div className="">
            <a
              href="/"
              className="bg-red-500 rounded-full p-2 text-white self-center h-10 w-10 "
            >
              {props.speaks}
            </a>
          </div>
          <div className="space-y-6 space-x-2  ">
            <div>{props.text && <p>{props.text.stringValue}</p>}</div>
            <div className="flex flex-wrap">
              {renderQuickReplies(props.payload)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickReplies;
