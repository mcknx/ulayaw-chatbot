import React, { useState } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import { ThoughtDiaryContext } from "../Context/ThoughtDiaryContext";
import { GetAdverseAnswerContext } from "../Context/GetAdverseAnswerContext";
import { ShowMoodsContext } from "../Context/ShowMoodsContext";
import { GetHotEmotionCAnswerContext } from "../Context/GetHotEmotionCAnswerContext";
import { GetOtherEmotionCAnswerContext } from "../Context/GetOtherEmotionCAnswerContext";
import { ShowChatBox } from "../Context/ShowChatBox";
import { ThoughtDiaryFocusContext } from "../Context/ThoughtDiaryFocusContext";
import { MaxInputContext } from "../Context/MaxInputContext";
import { GetOtherEmotionAllContext } from "../Context/GetOtherEmotionAllContext";
import { HotEmotionRateContext } from "../Context/HotEmotionRateContext";
import { GetHotThoughtBContext } from "../Context/GetHotThoughtBContext";
import { GetOtherThoughtBContext } from "../Context/GetOtherThoughtBContext";
import { ShowUTSContext } from "../Context/ShowUTSContext";
import { GetUTSContext } from "../Context/GetUTSContext";
import { GetUTSContainerContext } from "../Context/GetUTSContainerContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { HotThoughtRateContext } from "../Context/HotThoughtRateContext";
import { GetForEvidenceDContext } from "../Context/GetForEvidenceDContext";
import { GetAgainstEvidenceDContext } from "../Context/GetAgainstEvidenceDContext";
import { GetLocationContext } from "../Context/GetLocationContext";
import "./App.css";
import Header from "./Header";
import Footer from "./Footer";
import Landing from "./pages/Landing";

import About from "./pages/About";
import Shop from "./shop/Shop";
import Chatbot from "./chatbot/Chatbot";
// import PetCard from "./PetCard";
import Basket from "./Basket";
import UTS from "./UTS";

function App() {
  const [showThoughtDiaryTool, setShowThoughtDiaryTool] = useState(false);
  const [getAdverseStep3, setGetAdverseStep3] = useState(null);
  const [getHotEmotionCAnswer, setGetHotEmotionCAnswer] = useState(null);
  const [getOtherEmotionCAnswer, setGetOtherEmotionCAnswer] = useState(null);
  const [showChatBox, setShowChatBox] = useState(false);
  const [showMoods, setShowMoods] = useState(false);
  const [focusThoughtDiaryLetter, setFocusThoughtDiaryLetter] = useState(null);
  const [maxInput, setMaxInput] = useState(0);
  const [getOtherEmotionAll, setGetOtherEmotionAll] = useState([]);
  const [getHotEmotionRate, setGetHotEmotionRate] = useState(0);
  const [getHotThoughtB, setGetHotThoughtB] = useState([]);
  const [getOtherThoughtB, setGetOtherThoughtB] = useState([]);
  const [showUTS, setShowUTS] = useState(false);
  const [getUTS, setGetUTS] = useState();
  const [getUTSContainer, setGetUTSCointainer] = useState([]);
  const [getHotThoughtRate, setGetHotThoughtRate] = useState(0);
  const [getForEvidenceD, setGetForEvidenceD] = useState([]);
  const [getAgainstEvidenceD, setGetAgainstEvidenceD] = useState([]);
  const [getLocation, setGetLocation] = useState(false);

  return (
    <DndProvider backend={HTML5Backend}>
      <ShowMoodsContext.Provider
        value={{
          showMoods,
          setShowMoods,
        }}
      >
        <div
          className={
            showMoods
              ? "flex justify-center bg-[#3D829F] bg-opacity-[0.75]  w-full h-screen absolute"
              : "flex justify-center w-full h-screen"
          }
        >
          <BrowserRouter>
            <div className=" w-full h-full ">
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
                              <HotEmotionRateContext.Provider
                                value={{
                                  getHotEmotionRate,
                                  setGetHotEmotionRate,
                                }}
                              >
                                <GetOtherThoughtBContext.Provider
                                  value={{
                                    getOtherThoughtB,
                                    setGetOtherThoughtB,
                                  }}
                                >
                                  <GetHotThoughtBContext.Provider
                                    value={{
                                      getHotThoughtB,
                                      setGetHotThoughtB,
                                    }}
                                  >
                                    <ShowUTSContext.Provider
                                      value={{
                                        showUTS,
                                        setShowUTS,
                                      }}
                                    >
                                      <GetUTSContext.Provider
                                        value={{
                                          getUTS,
                                          setGetUTS,
                                        }}
                                      >
                                        <GetUTSContainerContext.Provider
                                          value={{
                                            getUTSContainer,
                                            setGetUTSCointainer,
                                          }}
                                        >
                                          <HotThoughtRateContext.Provider
                                            value={{
                                              getHotThoughtRate,
                                              setGetHotThoughtRate,
                                            }}
                                          >
                                            <GetForEvidenceDContext.Provider
                                              value={{
                                                getForEvidenceD,
                                                setGetForEvidenceD,
                                              }}
                                            >
                                              <GetAgainstEvidenceDContext.Provider
                                                value={{
                                                  getAgainstEvidenceD,
                                                  setGetAgainstEvidenceD,
                                                }}
                                              >
                                                <GetLocationContext.Provider
                                                  value={{
                                                    getLocation,
                                                    setGetLocation,
                                                  }}
                                                >
                                                  {/* contexts above */}
                                                  <Route
                                                    exact
                                                    path="/"
                                                    component={Landing}
                                                  />

                                                  <Chatbot />
                                                </GetLocationContext.Provider>
                                              </GetAgainstEvidenceDContext.Provider>
                                            </GetForEvidenceDContext.Provider>
                                          </HotThoughtRateContext.Provider>
                                        </GetUTSContainerContext.Provider>
                                      </GetUTSContext.Provider>
                                    </ShowUTSContext.Provider>
                                  </GetHotThoughtBContext.Provider>
                                </GetOtherThoughtBContext.Provider>
                              </HotEmotionRateContext.Provider>
                            </GetOtherEmotionAllContext.Provider>
                          </MaxInputContext.Provider>
                        </ThoughtDiaryFocusContext.Provider>
                      </ShowChatBox.Provider>
                    </GetOtherEmotionCAnswerContext.Provider>
                  </GetHotEmotionCAnswerContext.Provider>
                </GetAdverseAnswerContext.Provider>
              </ThoughtDiaryContext.Provider>

              <Footer />
            </div>
          </BrowserRouter>
        </div>
      </ShowMoodsContext.Provider>
    </DndProvider>
  );
}
export default App;
