import React, { useState, useEffect } from "react";
import axios from "axios/index";
import Message from "./Message";
function Chatbot() {
  const [messages, setMessages] = useState([]);

  async function df_text_query(text) {
    let says = {
      speaks: "user",
      msg: {
        text: {
          text: text,
        },
      },
    };
    setMessages({ messages: [...messages, says] });
    const res = await axios.post("/api/df_text_query", { text });

    for (let msg of res.data.fulfillmentMessages) {
      says = {
        speaks: "bot",
        msg: msg,
      };
      setMessages({ messages: [...messages, says] });
    }
  }

  async function df_event_query(event) {
    const res = await axios.post("/api/df_event_query", { event });
    // console.log(res);
    for (let msg of res.data.fulfillmentMessages) {
      let says = {
        speaks: "bot",
        msg: msg,
      };

      // Version 1
      // setMessages((prevMessages) => {
      //   return {
      //     ...prevMessages,
      //     says,
      //   };
      // });

      // Version 2
      setMessages([...messages, says]);

      // Version 3
      // setMessages(...messages, says);
    }
  }
  useEffect(() => {
    df_event_query("Welcome");
  }, []);
  function renderMessages(returnedMessages) {
    if (returnedMessages) {
      console.log(returnedMessages);

      return returnedMessages.map((message, i) => {
        return (
          <Message
            key={i}
            speaks={message.speaks}
            text={message.msg.text.text}
          />
        );
      });
    } else {
      return null;
    }
  }
  // jsx
  return (
    <div className="h-96 w-full md:w-96 float-right border-2 ">
      <div className="w-full h-full overflow-auto p-4 space-y-2">
        <h2>Chatbot</h2>
        {renderMessages(messages)}
        <input type="text" />
      </div>
    </div>
  );
}

// const Chatbot = () => <h2>Chatbot will be here</h2>;

export default Chatbot;
