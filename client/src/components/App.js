import React, { useState } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { ThoughtDiaryContext } from "../Context/ThoughtDiaryContext";
import { GetAdverseAnswerContext } from "../Context/GetAdverseAnswerContext";

import Header from "./Header";
import Landing from "./pages/Landing";

import About from "./pages/About";
import Shop from "./shop/Shop";
import Chatbot from "./chatbot/Chatbot";

function App() {
  const [showThoughtDiaryTool, setShowThoughtDiaryTool] = useState(false);
  const [getAdverseStep3, setGetAdverseStep3] = useState(null);
  return (
    <div className="flex justify-center">
      <BrowserRouter>
        <div className="w-full ">
          <Header />
          <ThoughtDiaryContext.Provider
            value={{
              showThoughtDiaryTool,
              setShowThoughtDiaryTool,
            }}
          >
            <GetAdverseAnswerContext.Provider
              value={{
                getAdverseStep3,
                setGetAdverseStep3,
              }}
            >
              <Route
                exact
                path="/"
                // showThoughtDiaryTool={showThoughtDiaryTool}
                // setShowThoughtDiaryTool={setShowThoughtDiaryTool}
                component={Landing}
              />

              {/* <Route exact path="/about" component={About} /> */}
              {/* <Route exact path="/shop" component={Shop} /> */}
              <Chatbot
              // showThoughtDiaryTool={showThoughtDiaryTool}
              // setShowThoughtDiaryTool={setShowThoughtDiaryTool}
              />
            </GetAdverseAnswerContext.Provider>
          </ThoughtDiaryContext.Provider>
        </div>
      </BrowserRouter>
    </div>
  );
}
export default App;
