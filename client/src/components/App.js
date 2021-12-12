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
import { ContinueThoughtDiaryContext } from "../Context/ContinueThoughtDiaryContext";
import { ShowAdminRoute } from "../Context/ShowAdminRoute";
import { ShowClientRoute } from "../Context/ShowClientRoute";
import { PresentEmotion } from "../Context/PresentEmotion";

import "./App.css";
import Header from "./Header";
import Footer from "./Footer";
import Landing from "./pages/Landing";
import Manual from "./pages/Manual";
import Team from "./pages/Team";
import About from "./pages/About";
import Feedback from "./pages/Feedback";
import Activate from "./Activate";
import ForgetPassword from "./ForgetPassword";
import Reset from "./Reset.jsx";

import Admin from "./Admin";
import ModalLogin from "./ModalLogin";
import PdfExtract from "./chatbot/PdfExtract";
// import { PDFViewer } from "@react-pdf/renderer";

import Shop from "./shop/Shop";
import Chatbot from "./chatbot/Chatbot";
// import PetCard from "./PetCard";
import Basket from "./Basket";
import UTS from "./UTS";
import Cookies from "universal-cookie";
const cookies = new Cookies();
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
  const [continueThoughtDiary, setContinueThoughtDiary] = useState(false);
  const [showAdminRoute, setShowAdminRoute] = useState(false);
  const [showClientRoute, setShowClientRoute] = useState(false);

  const [showPresentEmotion, setShowPresentEmotion] = useState(false);

  return (
    <DndProvider backend={HTML5Backend}>
      <PresentEmotion.Provider
        value={{
          showPresentEmotion,
          setShowPresentEmotion,
        }}
      >
        <ShowClientRoute.Provider
          value={{
            showClientRoute,
            setShowClientRoute,
          }}
        >
          <ShowAdminRoute.Provider
            value={{
              showAdminRoute,
              setShowAdminRoute,
            }}
          >
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
                    {!showAdminRoute && !cookies.get("adminLogged") ? (
                      <Header />
                    ) : (
                      ""
                    )}
                    <ContinueThoughtDiaryContext.Provider
                      value={{
                        continueThoughtDiary,
                        setContinueThoughtDiary,
                      }}
                    >
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
                                                          {!showAdminRoute &&
                                                          !cookies.get(
                                                            "adminLogged"
                                                          ) ? (
                                                            <Route
                                                              exact
                                                              path="/"
                                                              component={
                                                                Landing
                                                              }
                                                            />
                                                          ) : (
                                                            ""
                                                          )}
                                                          {!showAdminRoute &&
                                                          !cookies.get(
                                                            "adminLogged"
                                                          ) ? (
                                                            <Route
                                                              exact
                                                              path="/manual"
                                                              component={Manual}
                                                            />
                                                          ) : (
                                                            ""
                                                          )}
                                                          {!showAdminRoute &&
                                                          !cookies.get(
                                                            "adminLogged"
                                                          ) ? (
                                                            <Route
                                                              exact
                                                              path="/team"
                                                              component={Team}
                                                            />
                                                          ) : (
                                                            ""
                                                          )}
                                                          {!showAdminRoute &&
                                                          !cookies.get(
                                                            "adminLogged"
                                                          ) ? (
                                                            <Route
                                                              exact
                                                              path="/about"
                                                              component={About}
                                                            />
                                                          ) : (
                                                            ""
                                                          )}
                                                          {!showAdminRoute &&
                                                          !cookies.get(
                                                            "adminLogged"
                                                          ) ? (
                                                            <Route
                                                              exact
                                                              path="/feedback"
                                                              component={
                                                                Feedback
                                                              }
                                                            />
                                                          ) : (
                                                            ""
                                                          )}
                                                          <Route
                                                            path="/users/password/forget"
                                                            exact
                                                            render={(props) => (
                                                              <ForgetPassword
                                                                {...props}
                                                              />
                                                            )}
                                                          />

                                                          <Route
                                                            path="/users/activate/:token"
                                                            exact
                                                            render={(props) => (
                                                              <Activate
                                                                {...props}
                                                              />
                                                            )}
                                                          />
                                                          <Route
                                                            path="/users/password/reset/:token"
                                                            exact
                                                            render={(props) => (
                                                              <Reset
                                                                {...props}
                                                              />
                                                            )}
                                                          />
                                                          {/* <Route
                                                        path="/admin"
                                                        exact
                                                        render={(props) => (
                                                          <Admin {...props} />
                                                        )}
                                                      /> */}
                                                          {/* <Route
                                                        path="/login"
                                                        exact
                                                        render={(props) => (
                                                          <ModalLogin
                                                            {...props}
                                                          />
                                                        )}
                                                      /> */}
                                                          {cookies.get(
                                                            "adminLogged"
                                                          ) ||
                                                          showAdminRoute ? (
                                                            <Admin />
                                                          ) : (
                                                            ""
                                                          )}
                                                          {!showAdminRoute &&
                                                          !cookies.get(
                                                            "adminLogged"
                                                          ) ? (
                                                            <Chatbot />
                                                          ) : (
                                                            ""
                                                          )}

                                                          {/* <PDFViewer>
                                                    <Route
                                                      path="/showPDF"
                                                      exact
                                                      render={(props) => (
                                                        <PdfExtract
                                                          {...props}
                                                        />
                                                      )}
                                                    />
                                                  </PDFViewer> */}
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
                    </ContinueThoughtDiaryContext.Provider>

                    {!showAdminRoute &&
                    !showClientRoute &&
                    !cookies.get("adminLogged") &&
                    !cookies.get("clientLogged") ? (
                      <Footer />
                    ) : (
                      ""
                    )}
                  </div>
                </BrowserRouter>
              </div>
            </ShowMoodsContext.Provider>
          </ShowAdminRoute.Provider>
        </ShowClientRoute.Provider>
      </PresentEmotion.Provider>
    </DndProvider>
  );
}
export default App;
