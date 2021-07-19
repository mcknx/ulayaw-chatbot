import React, { useState, useEffect, useRef } from "react";
import axios from "axios/index";
import Message from "./Message";
import Card from "./Card";
import Cookies from "universal-cookie";
import { v4 as uuid } from "uuid";
import QuickReplies from "./QuickReplies";
import { withRouter } from "react-router-dom";

const cookies = new Cookies();

function Chatbot(props) {
  const [messages, setMessages] = useState([]);
  const [showBot, setShowBot] = useState(true);
  const [shopWelcomeSent, setShopWelcomeSent] = useState(false);
  let messagesEnd = useRef(null);
  let talkInput = useRef(null);

  if (cookies.get("userID") === undefined) {
    cookies.set("userID", uuid(), { path: "/" });
  }
  console.log(cookies.get("userID"));

  async function df_text_query(queryText) {
    let says = {
      speaks: "user",
      msg: {
        text: {
          text: queryText,
        },
      },
    };
    // setMessages({ messages: [...messages, says] });

    // Version 2
    // setMessages([...messages, says]);

    setMessages((prevMessages) => {
      return [...prevMessages, says];
    });

    // const res = await axios.post("/api/df_text_query", { text: queryText });
    const res = await axios.post("/api/df_text_query", {
      text: queryText,
      userID: cookies.get("userID"),
    });

    for (let msg of res.data.fulfillmentMessages) {
      says = {
        speaks: "bot",
        msg: msg,
      };
      // Version 1
      // setMessages({ messages: [...messages, says] });

      // Version 2
      // setMessages([...messages, says]);

      setMessages((prevMessages) => {
        return [...prevMessages, says];
      });
    }
  }

  async function df_event_query(eventName) {
    // const res = await axios.post("/api/df_event_query", { event });
    const res = await axios.post("/api/df_event_query", {
      event: eventName,
      userID: cookies.get("userID"),
    });
    // console.log(res);
    for (let msg of res.data.fulfillmentMessages) {
      let says = {
        speaks: "bot",
        msg: msg,
      };

      // Version 1
      setMessages((prevMessages) => {
        return [...prevMessages, says];
      });

      // Version 2
      // setMessages([...messages, says]);

      // Version 3
      // setMessages(...messages, says);
    }
  }
  useEffect(() => {
    df_event_query("Welcome");

    if (window.location.pathname === "/about" && !shopWelcomeSent) {
      df_event_query("WELCOME_SHOP");
      setShowBot(true);
      setShopWelcomeSent(true);
    }

    props.history.listen(() => {
      if (props.history.location.pathname === "/about" && !shopWelcomeSent) {
        df_event_query("WELCOME_SHOP");
        setShowBot(true);
        setShopWelcomeSent(true);
      }
    });
  }, []);

  function show(event) {
    event.preventDefault();
    event.stopPropagation();
    setShowBot(true);
  }

  function hide(event) {
    event.preventDefault();
    event.stopPropagation();
    setShowBot(false);
  }

  function _handleQuickReplyPayload(event, payload, text) {
    event.preventDefault();
    event.stopPropagation();

    switch (payload) {
      case "recommended_yes":
        df_event_query("SHOW_RECOMMENDATIONS");
        break;
      case "training_masterclass":
        df_event_query("MASTERCLASS");
      default:
        df_text_query(text);
        break;
    }
  }

  function renderCards(cards) {
    return cards.map((card, i) => <Card key={i} payload={card.structValue} />);
  }

  function renderOneMessage(message, i) {
    if (message.msg && message.msg.text && message.msg.text.text) {
      return (
        <Message key={i} speaks={message.speaks} text={message.msg.text.text} />
      );
    } else if (message.msg && message.msg.payload.fields.cards) {
      //message.msg.payload.fields.cards.listValue.values

      return (
        <div className="border-2 border-black rounded-lg p-2 mb-2 " key={i}>
          <div className="bg-gray-500 rounded-full p-2 text-white self-center h-10 w-10 ">
            <a href="/">{message.speaks}</a>
          </div>
          <div className="border-2 border-black rounded-lg p-2 mb-2 transform scale-75">
            <div style={{ overflow: "hidden" }}>
              <div className="overflow-y-hidden" style={{ height: 400 }}>
                <div
                  className="flex flex-row space-x-2 "
                  style={{
                    height: 300,
                    width:
                      message.msg.payload.fields.cards.listValue.values.length *
                      240,
                  }}
                >
                  {renderCards(
                    message.msg.payload.fields.cards.listValue.values
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (
      message.msg &&
      message.msg.payload &&
      message.msg.payload.fields &&
      message.msg.payload.fields.quick_replies
    ) {
      return (
        <QuickReplies
          text={
            message.msg.payload.fields.text
              ? message.msg.payload.fields.text
              : null
          }
          key={i}
          replyClick={_handleQuickReplyPayload}
          speaks={message.speaks}
          payload={message.msg.payload.fields.quick_replies.listValue.values}
        />
      );
    }
  }

  function renderMessages(returnedMessages) {
    if (returnedMessages) {
      // console.log(returnedMessages);

      return returnedMessages.map((message, i) => {
        return renderOneMessage(message, i);
      });
    } else {
      return null;
    }
  }
  function _handleInputKeyPress(e) {
    if (e.key === "Enter") {
      df_text_query(e.target.value);
      e.target.value = "";
    }
  }
  useEffect(() => {
    messagesEnd.scrollIntoView({ behavior: "smooth" });
    console.log(talkInput);
    if (talkInput.current != null) {
      talkInput.focus();
    }
  });
  // jsx
  if (showBot) {
    return (
      <>
        <div
          className=" w-full md:w-96  border-2 bottom-0  right-0  fixed bg-white h-full md:h-3/4 pb-52"
          // style={{ height: 500 }}
        >
          <nav>
            <div className="bg-gray-100 p-4 flex flex-row justify-between">
              <a href="/" className="brand-logo">
                Ulayaw - Chatbot
              </a>
              <ul className="right-0">
                <li className="">
                  <a
                    href="/"
                    // onClick={() => {
                    //   setShowBot(!showBot);
                    // }}

                    onClick={hide}
                  >
                    Close
                  </a>
                </li>
              </ul>
            </div>
          </nav>

          <div
            className="w-full h-full  overflow-auto space-y-2 "
            //
          >
            <div className="mb-10 p-2 ">{renderMessages(messages)}</div>
            <div
              ref={(el) => {
                messagesEnd = el;
              }}
              className="clear-both"
              // style={{ float: "left", clear: "both" }}
            ></div>
          </div>
        </div>
        <div className="bg-gray-100  px-4 fixed w-full md:w-96 bottom-0 right-0">
          <input
            className="border-2 rounded-lg border-red-500 p-2 w-full my-14 "
            type="text"
            onKeyPress={_handleInputKeyPress}
            placeholder="Type here ..."
            ref={(input) => {
              talkInput = input;
            }}
          />
        </div>
      </>
    );
  } else {
    return (
      <>
        <div
          className=" w-full md:w-96  border-2 bottom-0  right-0  fixed bg-white   "
          // style={{ height: 500 }}
        >
          <nav>
            <div className="bg-gray-100 p-4 flex flex-row justify-between">
              <a href="/" className="brand-logo">
                Ulayaw - Chatbot
              </a>
              <ul className="right-0">
                <li className="">
                  <a
                    href="/"
                    // onClick={() => {
                    //   setShowBot(!showBot);
                    // }}
                    onClick={show}
                  >
                    Show
                  </a>
                </li>
              </ul>
            </div>
          </nav>
          <div
            ref={(el) => {
              messagesEnd = el;
            }}
            className="clear-both"
            // style={{ float: "left", clear: "both" }}
          ></div>
        </div>
      </>
    );
  }
}

// const Chatbot = () => <h2>Chatbot will be here</h2>;

export default withRouter(Chatbot);
