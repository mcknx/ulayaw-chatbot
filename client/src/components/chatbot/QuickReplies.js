import React from "react";

function QuickReplies(props) {
  function _handleClick(event, payload, text) {
    props.replyClick(event, payload, text);
  }
  return <div></div>;
}

export default QuickReplies;
