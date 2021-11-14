import React, { useState } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { ThoughtDiaryContext } from "../Context/ThoughtDiaryContext";
import { GetAdverseAnswerContext } from "../Context/GetAdverseAnswerContext";
import { ShowMoodsContext } from "../Context/ShowMoodsContext";
import { GetHotEmotionCAnswerContext } from "../Context/GetHotEmotionCAnswerContext";
import { GetOtherEmotionCAnswerContext } from "../Context/GetOtherEmotionCAnswerContext";
import { ShowChatBox } from "../Context/ShowChatBox";
import { ThoughtDiaryFocusContext } from "../Context/ThoughtDiaryFocusContext";
import { MaxInputContext } from "../Context/MaxInputContext";
import { GetOtherEmotionAllContext } from "../Context/GetOtherEmotionAllContext";

import "./App.css";
import Header from "./Header";
import Landing from "./pages/Landing";

import About from "./pages/About";
import Shop from "./shop/Shop";
import Chatbot from "./chatbot/Chatbot";

function App() {
  const [showThoughtDiaryTool, setShowThoughtDiaryTool] = useState(false);
  const [getAdverseStep3, setGetAdverseStep3] = useState(null);
  const [getHotEmotionCAnswer, setGetHotEmotionCAnswer] = useState(null);
  const [getOtherEmotionCAnswer, setGetOtherEmotionCAnswer] = useState(null);
  const [showChatBox, setShowChatBox] = useState(true);
  const [showMoods, setShowMoods] = useState(false);
  const [focusThoughtDiaryLetter, setFocusThoughtDiaryLetter] = useState(null);
  const [maxInput, setMaxInput] = useState(0);
  const [getOtherEmotionAll, setGetOtherEmotionAll] = useState([]);

  return (
    <ShowMoodsContext.Provider
      value={{
        showMoods,
        setShowMoods,
      }}
    >
      <div
        className={
          showMoods
            ? "flex justify-center bg-[#3D829F] bg-opacity-[0.75] w-full h-full absolute"
            : "flex justify-center"
        }
      >
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
                <GetHotEmotionCAnswerContext.Provider
                  value={{
                    getHotEmotionCAnswer,
                    setGetHotEmotionCAnswer,
                  }}
                >
                  <GetOtherEmotionCAnswerContext.Provider
                    value={{
                      getOtherEmotionCAnswer,
                      setGetOtherEmotionCAnswer,
                    }}
                  >
                    <ShowChatBox.Provider
                      value={{
                        showChatBox,
                        setShowChatBox,
                      }}
                    >
                      <ThoughtDiaryFocusContext.Provider
                        value={{
                          focusThoughtDiaryLetter,
                          setFocusThoughtDiaryLetter,
                        }}
                      >
                        <MaxInputContext.Provider
                          value={{
                            maxInput,
                            setMaxInput,
                          }}
                        >
                          <GetOtherEmotionAllContext.Provider
                            value={{
                              getOtherEmotionAll,
                              setGetOtherEmotionAll,
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
                          </GetOtherEmotionAllContext.Provider>
                        </MaxInputContext.Provider>
                      </ThoughtDiaryFocusContext.Provider>
                    </ShowChatBox.Provider>
                  </GetOtherEmotionCAnswerContext.Provider>
                </GetHotEmotionCAnswerContext.Provider>
              </GetAdverseAnswerContext.Provider>
            </ThoughtDiaryContext.Provider>
          </div>
        </BrowserRouter>
      </div>
    </ShowMoodsContext.Provider>
  );
}
export default App;
