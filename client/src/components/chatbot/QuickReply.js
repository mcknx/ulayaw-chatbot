import React, { useContext } from "react";
import { ShowChatBox } from "../../Context/ShowChatBox";

const QuickReply = (props) => {
  const { showChatBox, setShowChatBox } = useContext(ShowChatBox);

  if (props.reply.structValue.fields.payload) {
    return (
      <a
        style={{ margin: 3 }}
        href="/"
        className="bg-[#F2EFEF] rounded-full  p-2 px-4 self-center h-10  "
        onClick={(event) => {
          props.click(
            event,
            props.reply.structValue.fields.payload.stringValue,
            props.reply.structValue.fields.text.stringValue
          );
          // console.log(props.showDiary, "diary");
          if (props.showDiary) setShowChatBox(false);
          else setShowChatBox(true);
          if (props.showUTS) {
            setShowChatBox(false);
          }
          // if (props.dontShowChatBox) setShowChatBox(false);
        }}
      >
        {props.reply.structValue.fields.text.stringValue}
      </a>
    );
  } else {
    return (
      <a
        style={{ margin: 3 }}
        href={props.reply.structValue.fields.link.stringValue}
        className="bg-gray-500 rounded-full p-2 text-white self-center h-10 w-10 "
      >
        {props.reply.structValue.fields.text.stringValue}
      </a>
    );
  }
};

export default QuickReply;
