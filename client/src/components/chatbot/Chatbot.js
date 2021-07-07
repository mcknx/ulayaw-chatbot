import React, { useState } from "react";

function Chatbot() {
  const [messages, setMessages] = useState();
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
