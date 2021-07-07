import React, { useState } from "react";
import axios from "axios/index";

function Chatbot() {
  const [messages, setMessages] = useState();

  async function df_text_query(text) {
    let says = {
      speaks: "me",
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

    for (let msg of res.data.fulfillmentMessages) {
      says = {
        speaks: "me",
        msg: msg,
      };
      setMessages({ messages: [...messages, says] });
    }
  }

  return (
    <div className="h-96 w-64 float-right border-2 ">
      <div className="w-full h-full overflow-auto">
        <h2>Chatbot</h2>
        <input type="text" />
      </div>
    </div>
  );
}

// const Chatbot = () => <h2>Chatbot will be here</h2>;

export default Chatbot;
