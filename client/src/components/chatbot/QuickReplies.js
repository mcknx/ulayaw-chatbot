import React, { useState, useContext } from "react";
import QuickReply from "./QuickReply";
import { ShowChatBox } from "../../Context/ShowChatBox";

function QuickReplies(props) {
  const [isClicked, setIsClicked] = useState();
  const [showQuickReply, setShowQuickReply] = useState(true);
  const { showChatBox, setShowChatBox } = useContext(ShowChatBox);

  function _handleClick(event, payload, text) {
    props.replyClick(event, payload, text);
    setShowQuickReply(false);

    //
  }

  function renderQuickReply(reply, i) {
    return (
      <QuickReply
        // mood_assess={props.mood_assess}
        key={i}
        click={_handleClick}
        showDiary={props.showDiary}
        reply={reply}
        showUTS={props.showUTS}
        // dontShowChatBox={props.dontShowChatBox}
      />
    );
  }

  function renderQuickReplies(quickReplies) {
    setShowChatBox(false);
    if (quickReplies) {
      return quickReplies.map((reply, i) => {
        return renderQuickReply(reply, i);
      });
    } else {
      return null;
    }
  }

  return (
    <>
      {showQuickReply ? (
        <div
          className={"flex justify-center space-x-2  p-2 rounded-lg bottom-0 "}
        >
          {/* <div className={"flex justify-end flex-col"}>
      <div className=" rounded-full flex justify-center  text-white h-10 w-10  ">
        <img src="ulayaw.png" />
      </div>
    </div> */}

          <div
            className={
              "rounded-[10px] self-center overflow-ellipsis  px-4 py-2  text-black font-medium text-left "
            }
          >
            <span className="flex flex-wrap">
              {renderQuickReplies(props.payload)}
            </span>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default QuickReplies;
