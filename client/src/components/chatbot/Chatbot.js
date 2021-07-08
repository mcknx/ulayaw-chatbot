import React, { useState, useEffect, useRef } from "react";
import axios from "axios/index";
import Message from "./Message";
import Cookies from "universal-cookie";
import { v4 as uuid } from "uuid";

const cookies = new Cookies();

function Chatbot() {
  const [messages, setMessages] = useState([]);
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
  }, []);
  function renderMessages(returnedMessages) {
    if (returnedMessages) {
      // console.log(returnedMessages);

      return returnedMessages.map((message, i) => {
        if (message.msg && message.msg.text && message.msg.text.text) {
          return (
            <Message
              key={i}
              speaks={message.speaks}
              text={message.msg.text.text}
            />
          );
        } else {
          return <h2>Cards</h2>;
        }
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
    talkInput.focus();
  });
  // jsx
  return (
    <div className="h-96 w-full md:w-96 float-right border-2 ">
      <div className="w-full h-full overflow-auto p-4 space-y-2">
        <h2>Chatbot</h2>
        <div className="mb-10">{renderMessages(messages)}</div>
        <div
          ref={(el) => {
            messagesEnd = el;
          }}
          className="clear-both"
          // style={{ float: "left", clear: "both" }}
        ></div>

        <div className="bottom-0">
          <input
            className="border-2 rounded-lg border-red-500 p-2 w-full my-10 "
            type="text"
            onKeyPress={_handleInputKeyPress}
            placeholder="Type here ..."
            ref={(input) => {
              talkInput = input;
            }}
          />
        </div>
      </div>
    </div>
  );
}

// const Chatbot = () => <h2>Chatbot will be here</h2>;

export default Chatbot;
