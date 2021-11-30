import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios/index";
import Message from "./Message";
import Card from "./Card";
import Cookies from "universal-cookie";
import { ToastContainer, toast } from "react-toastify";
import { v4 as uuid } from "uuid";
import QuickReplies from "./QuickReplies";
import MultipleChoice from "./MultipleChoice";
import GetMoods from "./GetMoods/GetMoods";
import { withRouter } from "react-router-dom";
import "../../styles/chatbot.css";
import { ThoughtDiaryContext } from "../../Context/ThoughtDiaryContext";
import { GetAdverseAnswerContext } from "../../Context/GetAdverseAnswerContext";
import { GetHotEmotionCAnswerContext } from "../../Context/GetHotEmotionCAnswerContext.js";
import { GetOtherEmotionCAnswerContext } from "../../Context/GetOtherEmotionCAnswerContext.js";
import { ShowMoodsContext } from "../../Context/ShowMoodsContext";
import { ShowChatBox } from "../../Context/ShowChatBox";
import { ThoughtDiaryFocusContext } from "../../Context/ThoughtDiaryFocusContext";
import { MaxInputContext } from "../../Context/MaxInputContext";
import { GetOtherEmotionAllContext } from "../../Context/GetOtherEmotionAllContext";
import { HotEmotionRateContext } from "../../Context/HotEmotionRateContext";
import { GetHotThoughtBContext } from "../../Context/GetHotThoughtBContext";
import { GetOtherThoughtBContext } from "../../Context/GetOtherThoughtBContext";
import { ShowUTSContext } from "../../Context/ShowUTSContext";
import { GetUTSContext } from "../../Context/GetUTSContext";
import { GetUTSContainerContext } from "../../Context/GetUTSContainerContext";
import { HotThoughtRateContext } from "../../Context/HotThoughtRateContext";
import { GetForEvidenceDContext } from "../../Context/GetForEvidenceDContext";
import { GetAgainstEvidenceDContext } from "../../Context/GetAgainstEvidenceDContext";
import useGeoLocation from "../../hooks/useGeolocation";
import { GetLocationContext } from "../../Context/GetLocationContext";
import MapContainer from "./MapContainer";
import ModalLogin from "../ModalLogin";
import { useDrop } from "react-dnd";
import UTSCard from "./UTSCard";
import UTS from "../UTS";
import { Textfit } from "react-textfit";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import ulayawFace from "../../assets/ulayaw.png";

const cookies = new Cookies();

function ChatbotCopy(props) {
  const [messages, setMessages] = useState([]);
  const [messagesFilipino, setMessagesFilipino] = useState([]);
  const [showBot, setShowBot] = useState(true);
  const [shopWelcomeSent, setShopWelcomeSent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalLogin, setShowModalLogin] = useState(false);
  const [assessment_meron_companion, setassessment_meron_companion] =
    useState(false);
  const [claimCode, setClaimCode] = useState(false);
  const [correctCode, setCorrectCode] = useState(false);
  const [assessmentScore, setAssessmentScore] = useState();
  const [userLoggedIn, setUserLoggedIn] = useState();
  const [switchLanguage, setSwitchLanguage] = useState(true);
  // const { showMoods, setShowMoods } = useContext(ShowMoodsContext);
  const { showChatBox, setShowChatBox } = useContext(ShowChatBox);
  const { maxInput, setMaxInput } = useContext(MaxInputContext);
  const { focusThoughtDiaryLetter, setFocusThoughtDiaryLetter } = useContext(
    ThoughtDiaryFocusContext
  );
  const { getLocation, setGetLocation } = useContext(GetLocationContext);
  const location = useGeoLocation();
  const [quickRepliesWelcome, setQuickRepliesWelcome] = useState(true);

  // Step 1: Start by getting the mood
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [getMoodStep1, setGetMoodStep1] = useState(false);
  const [getMoodWhenStartedStep1, setGetMoodWhenStartedStep1] = useState("");

  // Step 2: Intro or Not Intro Thought Diary
  const { showThoughtDiaryTool, setShowThoughtDiaryTool } =
    useContext(ThoughtDiaryContext);
  // const [showThoughtDiaryTool, setShowThoughtDiaryTool] = useState(false);

  // Step 3: Get A) the Adverse part
  const [activateGetAdverseStep3, setActivateGetAdverseStep3] = useState(0);
  const { getAdverseStep3, setGetAdverseStep3 } = useContext(
    GetAdverseAnswerContext
  );
  const [getAdverseStep3UseState, setGetAdverseStep3UseState] = useState(null);

  // Step 4: Get C) the Consequences part
  const [getMoodHot, setGetMoodHot] = useState(false);
  const [getMoodOther, setGetMoodOther] = useState(false);
  const [getAfterFeelings, setGetAfterFeelings] = useState(false);
  const [getAfterFeelingsChat, setGetAfterFeelingsChat] = useState("");

  const { getHotEmotionCAnswer, setGetHotEmotionCAnswer } = useContext(
    GetHotEmotionCAnswerContext
  );
  const { getOtherEmotionCAnswer, setGetOtherEmotionCAnswer } = useContext(
    GetOtherEmotionCAnswerContext
  );
  const [showMoodsHot, setShowMoodsHot] = useState(false);
  const [showMoodsOther, setShowMoodsOther] = useState(false);
  const { getOtherEmotionAll, setGetOtherEmotionAll } = useContext(
    GetOtherEmotionAllContext
  );
  const [getRateEmotion, setGetRateEmotion] = useState(false);
  const { getHotEmotionRate, setGetHotEmotionRate } = useContext(
    HotEmotionRateContext
  );

  // Step 5: Get B)
  const [getOtherThoughtBool, setGetOtherThoughtBool] = useState(false);
  const { getHotThoughtB, setGetHotThoughtB } = useContext(
    GetHotThoughtBContext
  );
  const { getOtherThoughtB, setGetOtherThoughtB } = useContext(
    GetOtherThoughtBContext
  );

  // Step 5: Give UTS
  const { showUTS, setShowUTS } = useContext(ShowUTSContext);
  const [getUTSBool, setGetUTSBool] = useState(false);
  const [getUTSThoughtBool, setGetUTSThoughtBool] = useState(true);
  const [getUTSState, setGetUTSState] = useState("");
  const { getUTS, setGetUTS } = useContext(GetUTSContext);
  const [getUTSContainerState, setGetUTSCointainerState] = useState([]);
  const { getUTSContainer, setGetUTSCointainer } = useContext(
    GetUTSContainerContext
  );
  const [getRateThought, setGetRateThought] = useState(false);

  // Step 5: Get Hot Thought
  const [getHotThoughtBool, setGetHotThoughtBool] = useState(true);
  const { getHotThoughtRate, setGetHotThoughtRate } = useContext(
    HotThoughtRateContext
  );

  // Step 6: Explain D
  const [getExplainDBool, setGetExplainDBool] = useState(false);
  const { getForEvidenceD, setGetForEvidenceD } = useContext(
    GetForEvidenceDContext
  );
  const { getAgainstEvidenceD, setGetAgainstEvidenceD } = useContext(
    GetAgainstEvidenceDContext
  );

  let messagesEnd = useRef(null);
  let talkInput = useRef(null);

  if (cookies.get("userID") === undefined) {
    cookies.set("userID", uuid(), { path: "/" });
  }

  async function df_text_query(
    queryText,
    dfQuery,
    speaker,
    queryTextFil,
    extra
  ) {
    console.log(speaker);
    if (speaker === undefined) speaker = "user";
    if (speaker === "user") speaker = "user";
    let says = "";
    if (extra === "map") {
      says = {
        // speaks: "user",
        speaks: speaker,
        msg: {
          map: {
            text: queryText,
            latitude: location.coordinates.lat,
            longitude: location.coordinates.lng,
            key: "AIzaSyA6hz3_zGUdW-B6RrjX1zi2nKVfM9sRyjg",
          },
        },
      };

      // My Key
      // AIzaSyA6hz3_zGUdW-B6RrjX1zi2nKVfM9sRyjg

      // Free Key
      // AIzaSyAyesbQMyKVVbBgKVi2g6VX7mop2z96jBo
    } else {
      says = {
        // speaks: "user",
        speaks: speaker,
        msg: {
          text: {
            text: queryText,
            textFil: queryTextFil,
          },
        },
      };
    }
    // let says = {
    //   // speaks: "user",
    //   speaks: speaker,
    //   msg: {
    //     text: {
    //       text: queryText,
    //     },
    //   },
    // };

    // if (switchLanguage) {
    // setMessagesFilipino((prevMessages) => {
    //   return [...prevMessages, says];
    // });
    // } else {
    setMessages((prevMessages) => {
      return [...prevMessages, says];
    });
    // }

    if (dfQuery) {
      const res = await axios.post("/api/df_text_query", {
        text: queryText,
        userID: cookies.get("userID"),
      });

      for (let msg of res.data.fulfillmentMessages) {
        says = {
          speaks: "bot",
          msg: msg,
        };

        setMessages((prevMessages) => {
          return [...prevMessages, says];
        });
      }
    }

    // console.log(messages);
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
      // if (switchLanguage) {
      // setMessagesFilipino((prevMessages) => {
      //   return [...prevMessages, says];
      // });
      // } else {
      setMessages((prevMessages) => {
        return [...prevMessages, says];
      });
      // }

      // Version 2
      // setMessages([...messages, says]);

      // Version 3
      // setMessages(...messages, says);
    }
  }
  useEffect(async () => {
    console.log(location);

    if (location.loaded) {
      if (location.error) {
        if (location.error.code === 1) {
          df_text_query(
            `Please allow use location, go and follow this site. Refresh this page after Thank you!
            
            https://support.google.com/chrome/answer/142065?hl=en.`,
            false,
            "bot"
          );
        }
      }
      if (location.coordinates) {
        if (maxInput === 0) {
          if (cookies.get("termsAndConditions")) {
            _handleTranslate(
              `Thank you for granting us access to your location!`,
              `Maraming salamat sa pag bigay ng access sa iyong location!`
            );
          } else {
            _handleTranslate(
              `Thank you for granting us access to your location! Please read the terms and conditions above!`,
              `Maraming salamat sa pag bigay ng access sa iyong location! Basahin muna ang terms and conditions sa itasa!`
            );
          }

          setMaxInput(maxInput + 1);
        }

        // if (cookies.get("termsAndConditions")) {
        if (getLocation && cookies.get("termsAndConditions")) {
          setMaxInput(0);
          df_event_query("Welcome");
          _handleTranslate(
            `How are you! I am Ulayaw. I am here to help and respond about your mental health. Do you want to login first?`,
            `Kumusta! Ako si Ulayaw, nandito ako upang tulungan at tugunan ang iyong kaisipang pangkalusugan. Gusto mo bang mag login muna?`
          );
        }
        // console.log(location);
      }
    }
    await resolveAfterXSeconds(5);

    // if (window.location.pathname === "/" && !welcomeSent) {

    //   df_event_query("Welcome");
    //   setWelcomeSent(true);
    // }

    // props.history.listen(() => {
    //   if (props.history.location.pathname === "/" && !welcomeSent) {
    //     df_event_query("Welcome");
    //     setWelcomeSent(true);
    //   }
    // });

    // if (window.location.pathname === "/about" && !shopWelcomeSent) {
    //   await resolveAfterXSeconds(1);
    //   df_event_query("WELCOME_SHOP");
    //   setShowBot(true);
    //   setShopWelcomeSent(true);
    // }

    props.history.listen(() => {
      if (props.history.location.pathname === "/about" && !shopWelcomeSent) {
        df_event_query("WELCOME_SHOP");
        setShowBot(true);
        setShopWelcomeSent(true);
      }
    });
  }, [location, getLocation, cookies.get("termsAndConditions")]);

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

  function claim_code(input) {
    const code = "123";
    console.log(input);

    if (input === code) {
      console.log("correct code");
      // df_text_query("I have a code");
      setCorrectCode(true);
    } else {
      console.log("wrong code");
      // df_text_query("I have a code");
      setCorrectCode(false);
    }
  }

  function _handleInputKeyPress(e) {
    if (e.key === "Enter") {
      if (claimCode) {
        claim_code(e.target.value);
      } else if (activateGetAdverseStep3 === 1) {
        // _handleGetAdverseStep3(e);
        setGetAdverseStep3UseState(e.target.value);
        let inputData = e.target.value;
        axios
          .post(`/api/translate`, {
            inputData,
          })
          .then((res) => {
            toast.success(res.data.message);
            console.log(res);
            setActivateGetAdverseStep3(2);
            setShowChatBox(false);

            setGetAdverseStep3(getAdverseStep3UseState);
          })
          .catch((err) => {
            console.log(err.response);
            toast.error(err.response.data.errors);
          });

        // _handleTranslate(
        //   `Okay I got your answer here.'${e.target.value}'`,
        //   `Okay, nakuha ko yung sinagot mo. '${e.target.value}'`
        // );

        // console.log(getAdverseStep3);
      } else if (getMoodOther) {
        if (e.target.value !== "") {
          // df_text_query(e.target.value, false);
          _handleTranslate(`${e.target.value}`, `${e.target.value}`, true);
          let chat = e.target.value;
          setGetOtherEmotionAll((prevChats) => {
            return [...prevChats, chat];
          });
          setMaxInput(maxInput + 1);
          // console.log(messages[messages.length - 1]);
          // console.log(getOtherEmotionCAnswerChatB, "othes");

          // combining chatbox & emotions
          if (maxInput === 4) {
            setShowChatBox(true);
            setGetMoodOther(false);
            setMaxInput(0);
            df_event_query("ABC_THOUGHT_DIARY_C_AFTER_MOODS");
            _handleTranslate(
              `So what did you do after you experienced this feeling(s) specifically during those time?`,
              `Anong ginawa mo pagkatapos mong maranasan ang mga mood na ito noong mga panahong iyon? `
            );
          }
          // console.log(getOtherEmotionAll, "just the two of us");

          // console.log(getMoodAfterFeelngs);
          // setGetMoodFeelings(true);
        } else {
          _handleTranslate(
            `Please put anything in the chatbox`,
            `Mangyaring Lagyan mo ng ang ating chatbox`
          );
        }
      } else if (getRateEmotion) {
        let chat = e.target.value;
        if (e.target.value !== "") {
          if (parseInt(chat) != NaN) {
            chat = parseInt(chat);
            if (chat <= 0 || chat > 10) {
              _handleTranslate(
                `Please put a number between (1-10)`,
                `Mangyaring maglagay ng numero sa pagitan ng (1-10)`
              );
              // df_text_query("Please put a number between (1-10)", false, "bot");
            } else {
              if (chat > 0 && chat < 6) {
                // df_text_query(chat, false);
                _handleTranslate(`${chat}`, `${chat}`, true);
                _handleTranslate(
                  `Okay, that wasn't so strong. However, you mentioned experiencing these things that affected you. '${_handleMoods(
                    getHotEmotionCAnswer
                  )}' and '${_handleShowList(getOtherEmotionAll)}'`,
                  `Okay, hindi ganoon sama. Gayunpaman, binanggit mo ang karanasan sa mga bagay na ito na nakaapekto sa iyo. '${_handleMoods(
                    getHotEmotionCAnswer
                  )}' and '${_handleShowList(getOtherEmotionAll)}'`
                );
                // df_text_query(
                //   `Okay, that wasn't so strong. However, you mentioned experiencing these things that affected you.
                //   '${_handleMoods(getHotEmotionCAnswer)}' and
                // '${_handleShowList(getOtherEmotionAll)}'`,
                //   false,
                //   "bot"
                // );
              }
              if (chat > 5 && chat <= 10) {
                _handleTranslate(`${chat}`, `${chat}`, true);
                _handleTranslate(
                  `Okay, that's pretty strong. It's not surprising that you've noticed that these things affected you.  '${_handleMoods(
                    getHotEmotionCAnswer
                  )}' and '${_handleShowList(getOtherEmotionAll)}'`,
                  `Okay, medyo masama nga iyon. Hindi nakakagulat na napansin mo ang mga bagay na ito ay nakaapekto sa iyo.'${_handleMoods(
                    getHotEmotionCAnswer
                  )}' and '${_handleShowList(getOtherEmotionAll)}'`
                );
                // df_text_query(chat, false);
                // df_text_query(
                //   `Okay, that's pretty strong. It's not surprising that you've noticed that these things affected you.

                //   '${_handleMoods(
                //     getHotEmotionCAnswer
                //   )}' and '${_handleShowList(getOtherEmotionAll)}'`,
                //   false,
                //   "bot"
                // );
              }

              _handleTranslate(
                `Okay, so now we kind of have an idea that this is what happened. '${getAdverseStep3}'. Ito ang oras at lugar na napansin mo ang pagbabago sa iyong mood.`,
                `Okay, so ngayon medyo may ideya na tayo, na ganito ang nangyari. '${getAdverseStep3}'. Ito ang oras at lugar na napansin mo ang pagbabago sa iyong mood`
              );
              // df_text_query(
              //   `Okay, so now we kind of have an idea that this is what happened. '${getAdverseStep3}'. This is the time and place you noticed the change in your mood. `,
              //   false,
              //   "bot"
              // );
              _handleTranslate(
                `And these are the emotions you noticed. '${_handleMoods(
                  getHotEmotionCAnswer
                )}' and '${_handleShowList(getOtherEmotionAll)}'.`,
                `At ito ang mga emosyon na napansin mo. '${_handleMoods(
                  getHotEmotionCAnswer
                )}' and '${_handleShowList(getOtherEmotionAll)}'.`
              );
              // df_text_query(
              //   `And these are the emotions you noticed. '${_handleMoods(
              //     getHotEmotionCAnswer
              //   )}' and
              //   '${_handleShowList(getOtherEmotionAll)}'.`,
              //   false,
              //   "bot"
              // );
              _handleTranslate(
                `Okay, so what was on your mind if we could go back ${getMoodWhenStartedStep1} to the time and place when you said: '${getAdverseStep3}'.`,
                `Okay, ano ang nasa isip mo kung babalik tayo ${getMoodWhenStartedStep1} nung sinabi mong: '${getAdverseStep3}'.`
              );
              // df_text_query(
              //   `Okay, so what was on your mind if we could go back ${getMoodWhenStartedStep1} to the time and place when you said: '${getAdverseStep3}'.`,
              //   false,
              //   "bot"
              // );
              _handleTranslate(
                `Answer the question "What was going through my head at the time?`,
                `Sagutin ang tanong: "Ano ang tumatakbo sa isip ko noong panahong iyon?`
              );
              // df_text_query(
              //   `Answer the question "What was going through my head at the time?`,
              //   false,
              //   "bot"
              // );

              setGetRateEmotion(false);
              setGetAfterFeelings(false);
              setGetOtherThoughtBool(true);
              setShowChatBox(true);
              setGetHotEmotionRate(chat);
              setFocusThoughtDiaryLetter("a_b");
            }
            console.log(chat);
          }
        } else {
          df_text_query("Please put anything in the chatbox", false, "bot");
        }
      } else if (getAfterFeelings) {
        let chat = e.target.value;
        if (e.target.value !== "") {
          _handleTranslate(`${chat}`, `${chat}`, true);
          setGetAfterFeelingsChat(chat);
          setGetRateEmotion(true);
          df_event_query("ABC_THOUGHT_DIARY_C_RATE_EMOTION");
          _handleTranslate(
            `Okay, so I understand that you've had to deal with a lot of the consequences. However, these are only a few of the ones I noted. '${_handleMoods(
              getHotEmotionCAnswer
            )}' and '${_handleShowList(getOtherEmotionAll)}'`,

            `Okay, naiintindihan ko na kinailangan mong harapin ang maraming masasamang bagay na ito. Gayunpaman, ilan lamang ito sa mga nabanggit mo. '${_handleMoods(
              getHotEmotionCAnswer
            )}' and '${_handleShowList(getOtherEmotionAll)}'`
          );
          if (getAfterFeelings) {
            _handleTranslate(
              `And you did this after experiencing those.'${chat}'`,

              `At ginawa mo ito pagkatapos mong maranasan ang mga ito.'${chat}'`
            );
          }

          _handleTranslate(
            `Okay, so that '${_handleMoods(
              getHotEmotionCAnswer
            )}' feeling, um. When you say you felt it ${getMoodWhenStartedStep1} give me an idea of how strong it was.`,
            `Okay, itong '${_handleMoods(
              getHotEmotionCAnswer
            )}' na feeling, um. Kapag sinabi mong naramdaman mo ito ${getMoodWhenStartedStep1} bigyan mo ako ng ideya kung gaano ito sama.'`
          );
          _handleTranslate(
            `If you had to give it a rating out of ten (1-10), how would you rate it?`,
            `Kung kailangan mong bigyan ito ng rating sa sampu (1-10), paano mo ito ire-rate?`
          );

          // df_text_query(chat, false);
        } else {
          _handleTranslate(
            `Please put anything in the chatbox`,
            `Mangyaring Lagyan mo ng ang ating chatbox`
          );
          // df_text_query("Please put anything in the chatbox", false, "bot");
        }

        // console.log(getAfterFeelingsChat);
        // setGetRateEmotion(true);
        // setShowChatBox(false);
        // df_event_query("ABC_THOUGHT_DIARY_C_RATE_EMOTION");
      } else if (getOtherThoughtBool) {
        let chat = e.target.value;
        if (e.target.value !== "") {
          if (maxInput === 0) {
            setShowChatBox(true);
            // df_text_query(chat, false);
            _handleTranslate(`${chat}`, `${chat}`, true);
            // df_text_query(
            //   `Are you starting to get a feeling now for why that '${_handleMoods(
            //     getHotEmotionCAnswer
            //   )}' kind of feeling might have been so ${
            //     getHotEmotionRate > 5 ? "Strong" : "Slightly Strong"
            //   }. It's quite a good match if we look at B) and C)`,
            //   false,
            //   "bot"
            // );

            _handleTranslate(
              `Are you starting to get a feeling now for why that '${_handleMoods(
                getHotEmotionCAnswer
              )}' kind of feeling might have been so ${
                getHotEmotionRate > 5 ? "Strong" : "Slightly Strong"
              }. It's quite a good match if we look at B) and C)`,
              `Nagsisimula ka na bang magkaroon ng ideya ngayon kung bakit itong '${_handleMoods(
                getHotEmotionCAnswer
              )}' na feeling mo ay naging ${
                getHotEmotionRate > 5 ? "napakasama" : "hindi gaanong masama"
              } para sayo? Ito ay tugma sa kung anong isinulat mo sa C) titingnan natin ang B) at C) part`
            );

            setFocusThoughtDiaryLetter("b_c");
            _handleTranslate(
              `Is there any other thoughts that you have? if we could go back ${getMoodWhenStartedStep1} to the time and place when you said: ${getAdverseStep3}`,
              `May iba ka pa bang iniisip? kung babalik tayo ${getMoodWhenStartedStep1} sa oras at lugar nung sinabi mong ${getAdverseStep3}`
            );
            // df_text_query(
            //   `Is there any other thoughts that you have? if we could go back "recently" to the time and place when you said: ${getAdverseStep3}`,
            //   false,
            //   "bot"
            // );

            setMaxInput(2);
          }

          if (maxInput === 2) {
            _handleTranslate(`${chat}`, `${chat}`, true);
            // df_text_query(chat, false);
            _handleTranslate(
              `Okay, given that you think that way, when we look at the C) column. It's kind of a match for you that you couldn't figure out why you were feeling that way.`,
              `Okay, given na ganyan yung iniisip mo, siguro nagtataka ka kung bakit ganito yung nararamdaman mo. Pero kung titignan nating tong C) part. Ito ay tugma kung bakit hindi mo para bang maintindihan, kung bakit ka nakakaramdam ng ganoon.`
            );
            // df_text_query(
            //   `Okay, given that you think that way, when we look at the C) column, it's kind of a match for you that you couldn't figure out why you were feeling that way.`,
            //   false,
            //   "bot"
            // );

            _handleTranslate(
              `Give me 2 more of your thoughts during that time.`,
              `Bigyan mo ako ng dalawa(2) mo pang iniisip mo sa mga panahong iyon.`
            );
            // df_text_query(
            //   `Give me 2 more of your thoughts during that time.`,
            //   false,
            //   "bot"
            // );

            setFocusThoughtDiaryLetter("b_c");
            setMaxInput(3);
          }
          if (maxInput === 3) {
            // df_text_query(chat, false);
            _handleTranslate(`${chat}`, `${chat}`, true);
            // df_text_query(chat, false);
            _handleTranslate(
              `Give me 1 more of your thoughts during that time. Just in terms of the thoughts that you were thinking that time.`,
              `Okay, Bigyan mo ako ng isa pang iniisip mo sa mga panahong iyon. Yung mga naiisip mo that time.`
            );
            // df_text_query(
            //   `Was there any other thoughts that you noticed at the time?
            //   `,
            //   false,
            //   "bot"
            // );

            setFocusThoughtDiaryLetter("b");
            setMaxInput(4);
          }

          if (maxInput === 4) {
            // df_text_query(chat, false);
            _handleTranslate(`${chat}`, `${chat}`, true);
            // df_text_query(chat, false);
            _handleTranslate(
              `Okay wow, that's a lot of things! I'm happy that you have the bravery to share your thoughts with me. Okay, looking at that I'm thinking there's quite a few things that it might be really helpful for us to have a bit of a look at.`,
              `Okay wow, ang dami mong na ibahagi! Masaya ako na mayroon kang katapangan na ibahagi ang iyong mga saloobin sa akin. Okay, tinitingnan ko itong mga sagot mo, iniisip ko na may iilang bagay lang tayong tatalakayin na maaring makatulong dito.`
            );
            // df_text_query(
            //   `Okay wow, that's a lot of things. And looking at that I'm thinking there's quite a few things that it might be really helpful for us to have a bit of a look at.
            //   `,
            //   false,
            //   "bot"
            // );
            // df_text_query(
            //   `Um, because if these things were true: '${_handleShowList(
            //     getOtherThoughtB
            //   )}'
            //   `,
            //   false,
            //   "bot"
            // );
            // df_text_query(
            //   `then we'd really have a problem, like it would require a professional to kind of focus on fixing that problem.
            //   `,
            //   false,
            //   "bot"
            // );
            _handleTranslate(
              `Okay, I'm wondering whether some of these thoughts could be a reflection of your true problem; they could be the one component that, although not exactly accurate, are a component of your true problem.`,
              `Okay, Iniisip ko kung mayroong isa sa mga naibahigi mong kaisipan na maaaring maging salamin ng iyong tunay na problema; maaaring isa sa mga naibahigi mong kaisipan, na bagama't hindi eksaktong tumpak, ay isang sektor ng iyong tunay na problema.`
            );
            // df_text_query(
            //   `But I'm wondering whether some of these thoughts could be a reflection of your true problem; they could be the one component that, although not exactly accurate, are a component of your true problem.
            //   `,
            //   false,
            //   "bot"
            // );
            // df_text_query(
            //   `And if that's true we might be able to adjust them or think a little differently about the situation and hopefully feel a bit differently as a result.
            //   `,
            //   false,
            //   "bot"
            // );
            _handleTranslate(
              `And if that's true we might be able to adjust them or think a little differently about the situation and hopefully feel a bit differently as a result.`,
              `At kung ito ay totoo, maaari nating talakayin ang paksa ng kaisipang ito at mag-isip nang paraan tungkol sa sitwasyon, at umasa sa pag-asa na medyo maiba natin ang pakiramdam mo bilang resulta.`
            );

            setGetOtherThoughtBool(false);
            setShowChatBox(false);
            setFocusThoughtDiaryLetter("b");
            df_event_query("ABC_THOUGHT_DIARY_B");
          }

          // console.log(maxInput, "count", getOtherThoughtB.length, "lengt8h");
          setGetOtherThoughtB((prevChats) => {
            return [...prevChats, chat];
          });
        } else {
          // df_text_query("Please put anything in the chatbox", false, "bot");
          _handleTranslate(
            `Please put anything in the chatbox`,
            `Mangyaring Lagyan mo ng ang ating chatbox`
          );
        }
      } else if (getRateThought) {
        let chat = e.target.value;
        // console.log(getUTS.length);
        if (e.target.value !== "") {
          if (parseInt(chat) != NaN) {
            chat = parseInt(chat);
            df_text_query(chat, false, "user");
            if (chat <= 0 || chat > 100) {
              df_text_query(
                "Please put a number between (1-100)",
                false,
                "bot"
              );
            } else {
              if (chat > 0 && chat < 51) {
                df_text_query(
                  `Woah, okay so you're believing this slight strongly. `,
                  false,
                  "bot"
                );
                df_text_query(
                  `Okay let's do it again. I'd like you to give me a thought that is most likely related to your emotions. That is, the one thought that makes you feel worse, as stated in the C) column. One that's most distressing for you.`,
                  false,
                  "bot"
                );
                setFocusThoughtDiaryLetter("b_c");
                df_event_query("ABC_THOUGHT_DIARY_GET_HOT_THOUGHT");
              }
            }
            if (chat > 50 && chat <= 100) {
              setGetHotThoughtRate(chat);
              df_text_query(
                `Woah, okay so you're believing this strongly. `,
                false,
                "bot"
              );
              df_text_query(
                `I believe your feelings in C) would be different if you were able to believe this "hot thought" lesser than 50. You would have felt a little better than what you mentioned in the C) column.`,
                false,
                "bot"
              );
              df_text_query(
                `That is why when I see you've rated it as ${chat}% percent then I knew it was the one that is most likely connected with your emotions.`,
                false,
                "bot"
              );
              setGetRateThought(false);
              setGetExplainDBool(true);
              df_event_query("ABC_THOUGHT_EXPLAIN_D");
              setFocusThoughtDiaryLetter("b_c");
              setShowChatBox(false);

              setMaxInput(0);
            }
            console.log(chat);
          }
        } else {
          // df_text_query("Please put anything in the chatbox", false, "bot");
          _handleTranslate(
            `Please put anything in the chatbox`,
            `Mangyaring Lagyan mo ng ang ating chatbox`
          );
        }
      } else if (getExplainDBool) {
        let chat = e.target.value;
        // console.log(getUTS.length);

        if (e.target.value !== "") {
          df_text_query(chat, false, "user");
          setShowChatBox(false);
          if (maxInput === 2) {
            if (getForEvidenceD.length === 0) {
              setGetForEvidenceD([chat]);
            } else {
              setGetForEvidenceD((x) => {
                return [...x, chat];
              });
            }

            // df_event_query("ABC_THOUGHT_EXPLAIN_D_GET_FOR_2");
            console.log(getForEvidenceD, "getForEvidenceD");
            _handleExplainDQuickReply();
          }
          if (maxInput === 3) {
            setGetForEvidenceD((x) => {
              return [...x, chat];
            });

            console.log(getForEvidenceD, "getForEvidenceD");
            df_text_query(
              `Okay, I'm gonna leave that there for the moment we might need to go back and tweak that one a little bit as we go along.`,
              false,
              "bot"
            );
            setMaxInput(maxInput + 1);
            df_event_query("ABC_THOUGHT_EXPLAIN_D_GET_AGAINST_1");
          }

          if (maxInput === 4) {
            if (getAgainstEvidenceD.length === 0) {
              setGetAgainstEvidenceD([chat]);
            } else {
              setGetAgainstEvidenceD((x) => {
                return [...x, chat];
              });
            }
            _handleExplainDQuickReply();
            console.log(getAgainstEvidenceD, "getAgainstEvidenceD");
          }

          if (maxInput === 5) {
            setGetAgainstEvidenceD((x) => {
              return [...x, chat];
            });
            _handleExplainDQuickReply();
            console.log(getAgainstEvidenceD, "getAgainstEvidenceD");
          }
          if (maxInput === 6) {
            setGetAgainstEvidenceD((x) => {
              return [...x, chat];
            });
            _handleExplainDQuickReply();
            console.log(getAgainstEvidenceD, "getAgainstEvidenceD");
          }
          if (maxInput === 7) {
            setGetAgainstEvidenceD((x) => {
              return [...x, chat];
            });
            _handleExplainDQuickReply();
            console.log(getAgainstEvidenceD, "getAgainstEvidenceD");
          }
          if (maxInput === 8) {
            setGetAgainstEvidenceD((x) => {
              return [...x, chat];
            });
            _handleExplainDQuickReply();
            console.log(getAgainstEvidenceD, "getAgainstEvidenceD");
          }
          if (maxInput === 9) {
            setGetAgainstEvidenceD((x) => {
              return [...x, chat];
            });
            _handleExplainDQuickReply();
            console.log(getAgainstEvidenceD, "getAgainstEvidenceD");
          }
          if (maxInput === 10) {
            setGetAgainstEvidenceD((x) => {
              return [...x, chat];
            });
            _handleExplainDQuickReply();
            console.log(getAgainstEvidenceD, "getAgainstEvidenceD");
          }
          if (maxInput === 11) {
            setGetAgainstEvidenceD((x) => {
              return [...x, chat];
            });
            _handleExplainDQuickReply();
            console.log(getAgainstEvidenceD, "getAgainstEvidenceD");
          }
          if (maxInput === 12) {
            setGetAgainstEvidenceD((x) => {
              return [...x, chat];
            });
            // _handleExplainDQuickReply();
            console.log(getAgainstEvidenceD, "getAgainstEvidenceD");

            df_text_query(
              `Um, so we've got a few things there. Some really interesting things that you've identified that perhaps don't quite fit with this belief: "${getHotThoughtB[0]}"
              `,
              false,
              "bot"
            );
            df_text_query(
              ` You've got some things in the for and some things in the against.
              `,
              false,
              "bot"
            );
            df_text_query(
              ` Um in a little bit we're going to talk about how do you balance those up and make sense of all these things being true. But the next step I'm going to get you to go through is to have a look at the unhelpful thinking styles.
              `,
              false,
              "bot"
            );

            df_text_query(
              ` So now I will show you this unhelpful thinking styles disputation questions this is where it reminds you about the process of disputation.
              `,
              false,
              "bot"
            );
            df_text_query(
              `  So if we could hover over those unhelpful thinking styles graphic interface you would see Disputation Questions in there.
              `,
              false,
              "bot"
            );
            df_event_query("ABC_THOUGHT_EXPLAIN_D_GET_D_Q");
          }
        } else {
          // df_text_query("Please put anything in the chatbox", false, "bot");
          _handleTranslate(
            `Please put anything in the chatbox`,
            `Mangyaring Lagyan mo ng ang ating chatbox`
          );
        }
      } else {
        if (e.target.value !== "") df_text_query(e.target.value, true);
      }

      e.target.value = "";
    }
  }

  function _handleShowThoughtDiary() {
    console.log(showThoughtDiaryTool);
    return renderOneMessageStatic("THOUGHT DIARY");
  }

  function _handleTranslate(engText, filText, speaker) {
    // if (switchLanguage) {
    if (speaker) {
      df_text_query(engText, false, "user", filText);
    } else {
      df_text_query(engText, false, "bot", filText);
    }

    // } else {
    // df_text_query(engText, false, "bot", "");
    // }
  }

  async function _handleTranslateEng(inputData, nlp) {
    if (nlp) {
      return await axios
        .get(`/api/useApi/understand/${inputData}`)
        .then((res) => {
          console.log(res);
          // return res.data.data;
        })
        .catch((err) => {
          console.log(err.response);
          // toast.error(err.response.data.errors);
        });
    } else {
      return await axios
        .get(`/api/useApi/translate/${inputData}`)
        .then((res) => {
          console.log(res);
          return res.data.data;
        })
        .catch((err) => {
          console.log(err.response);
          // toast.error(err.response.data.errors);
        });
    }
  }

  function _handleQuickReplyPayload(event, payload, text) {
    if (text != "I have a code") {
      // df_text_query(text, false);
      _handleTranslate(text, text, true);
    }

    event.preventDefault();
    event.stopPropagation();

    // if (payload === "long time ago" || payload === "recently") {
    //   setGetMoodWhenStartedStep1(payload);
    //   // console.log(getMoodWhenStartedStep1);

    // }

    console.log(payload);

    switch (payload) {
      case "recommended_yes":
        df_event_query("SHOW_RECOMMENDATIONS");
        break;
      case "assessment_meron_companion":
        setShowModalLogin(true);
        setassessment_meron_companion(true);
        _handleTranslate(
          `Nais kong panatilihing mo makiugnay kay $companion. Maaari mo siyang kausapin o bigyan ng indikasyon na-aayon sa iyong nararamdaman o naiisip.`,
          `Nais kong panatilihing mo makiugnay kay $companion. Maaari mo siyang kausapin o bigyan ng indikasyon na-aayon sa iyong nararamdaman o naiisip.`
        );

        _handleTranslate(
          `Salamat sa pagkakataong ibinigay mo upang mapag usapan ang iyong mga suliranin. Base sa ating mga napag usapan, mas makatutulong na ipagpatuloy ang pagproseso ng iyong concerns sa pamamagitan ng psychiatric consultation. Huwag ka sanang mahihiyang lumapit muli sa akin kapag kailangan mo ulit ng aming tulong. Palagi kang mag iingat!`,
          `Salamat sa pagkakataong ibinigay mo upang mapag usapan ang iyong mga suliranin. Base sa ating mga napag usapan, mas makatutulong na ipagpatuloy ang pagproseso ng iyong concerns sa pamamagitan ng psychiatric consultation. Huwag ka sanang mahihiyang lumapit muli sa akin kapag kailangan mo ulit ng aming tulong. Palagi kang mag iingat!`
        );

        _handleTranslate(
          `Nais mo na bang ipagpatuloy ang pakikipag usap natin? May ibabahagi sana akong tool sa iyo.`,
          `Nais mo na bang ipagpatuloy ang pakikipag usap natin? May ibabahagi sana akong tool sa iyo.`
        );

        _handleTranslate(
          `Ito ay ginagamit ko paminsan minsan upang ma bawasan ang bigat na aking nararamdaman. 🤗`,
          `Ito ay ginagamit ko paminsan minsan upang ma bawasan ang bigat na aking nararamdaman. 🤗`
        );
        // df_text_query(
        //   `Change to your current location, a nearby police station, or a nearby hospital by clicking the red circle!`,
        //   false,
        //   `Change to your current location, a nearby police station, or a nearby hospital by clicking the red circle!`,
        //   "bot",
        //   "map"
        // );
        break;
      case "assessment_wala_companion":
        df_event_query("ASSESSMENT_DONE");
        _handleTranslate(
          `Salamat sa pagkakataong ibinigay mo upang mapag usapan ang iyong mga suliranin. Base sa ating mga napag usapan, mas makatutulong na ipagpatuloy ang pagproseso ng iyong concerns sa pamamagitan ng psychiatric consultation. Huwag ka sanang mahihiyang lumapit muli sa akin kapag kailangan mo ulit ng aming tulong. Palagi kang mag iingat!`,
          `Salamat sa pagkakataong ibinigay mo upang mapag usapan ang iyong mga suliranin. Base sa ating mga napag usapan, mas makatutulong na ipagpatuloy ang pagproseso ng iyong concerns sa pamamagitan ng psychiatric consultation. Huwag ka sanang mahihiyang lumapit muli sa akin kapag kailangan mo ulit ng aming tulong. Palagi kang mag iingat!`
        );

        _handleTranslate(
          `Nais mo na bang ipagpatuloy ang pakikipag usap natin? May ibabahagi sana akong tool sa iyo.`,
          `Nais mo na bang ipagpatuloy ang pakikipag usap natin? May ibabahagi sana akong tool sa iyo.`
        );

        _handleTranslate(
          `Ito ay ginagamit ko paminsan minsan upang ma bawasan ang bigat na aking nararamdaman. 🤗`,
          `Ito ay ginagamit ko paminsan minsan upang ma bawasan ang bigat na aking nararamdaman. 🤗`
        );
        // df_text_query(
        //   `Change to your current location, a nearby police station, or a nearby hospital by clicking the red circle!`,
        //   false,
        //   `Change to your current location, a nearby police station, or a nearby hospital by clicking the red circle!`,
        //   "bot",
        //   "map"
        // );
        break;
      case "training_masterclass":
        df_event_query("MASTERCLASS");
        break;
      case "training_demographics-continue":
        // setShowMoods(true);

        _handleTranslate(
          `Hi ${userLoggedIn.first_name}, I'm glad you are here today. Maybe we could start by getting your moods. I want you to pick the most likely feelings you are experiencing right now first.`,
          `Hi ${userLoggedIn.first_name}, natutuwa ako na narito ka ngayon. Siguro maaari nating simulan sa pagkuha ng iyong mood. Pumili ka ng isa dito sa ating 'emotion box'`
        );

        df_event_query("ABC_GETMOOD");
        break;

      case "abc_continue_step_1":
        df_event_query("ABC_GETMOOD");
        break;
      // case "proceed_to_a":

      //   break;
      case "proceed_to_a_assess":
        break;
      case "show_thought_diary":
        setGetMoodWhenStartedStep1(text.toLowerCase());
        _handleTranslate(
          `Okay, while I was viewing your responses, it occurred to me that this would be a good subject for us to go through in my thought diary tool.
          I'm using this tool to try to figure out why your mood has changed. Because I want you to understand how important your thoughts may be in affecting your mood.`,
          `Okay, habang tinitingnan ko ang iyong mga tugon, naisip ko na ito ay isang magandang paksa para pag-usapan natin sa aking tool sa talaarawan sa pag-iisip. Ginagamit ko ang tool na ito para subukang malaman kung bakit nagbago ang iyong mood. Dahil gusto kong subukan mong maunawaan kung gaano kahalaga ang iyong mga iniisip sa nakakaapekto sa iyong mood.`
        );
        _handleTranslate(
          `Okay, so I'd like you to follow along with the thought diary tool, and we've also got it shown here in the background so that we can put down things there as well.`,
          `Baka gusto mong tingnan ang tool na ito para mas maunawaan kung ano ang tungkol dito. Dahil bago ka rito, maaaring gusto mong tingnan ang sunud-sunod na gabay na ito kung paano gamitin ang tool na ito ngunit huwag mag-alala, ituturo ko sa iyo ito.`
        );

        return df_event_query("ABC_THOUGHT_DIARY_NOT_INTRO");
      case "yes_mood_different":
        // setShowMoods(true);
        break;
      case "abc_explaining_c_nothing":
        df_event_query("ABC_THOUGHT_DIARY_C_RATE_EMOTION");
        _handleTranslate(
          `Okay, so I understand that you've had to deal with a lot of the consequences. However, these are only a few of the ones I noted. '${_handleMoods(
            getHotEmotionCAnswer
          )}' and '${_handleShowList(getOtherEmotionAll)}'`,
          `Okay, naiintindihan ko na kinailangan mong harapin ang maraming masasamang bagay na ito. Gayunpaman, ilan lamang ito sa mga nabanggit mo. '${_handleMoods(
            getHotEmotionCAnswer
          )}' and '${_handleShowList(getOtherEmotionAll)}'`
        );
        if (getAfterFeelings) {
          _handleTranslate(
            `And you did this after experiencing those.'${getAfterFeelingsChat}'`,

            `At ginawa mo ito pagkatapos mong maranasan ang mga ito.'${getAfterFeelingsChat}'`
          );
        }
        _handleTranslate(
          `Okay, so that '${_handleMoods(
            getHotEmotionCAnswer
          )}' feeling, um. When you say you felt it ${getMoodWhenStartedStep1} give me an idea of how strong it was.`,
          `Okay, itong '${_handleMoods(
            getHotEmotionCAnswer
          )}' na feeling, um. Kapag sinabi mong naramdaman mo ito ${getMoodWhenStartedStep1} bigyan mo ako ng ideya kung gaano ito sama.'`
        );
        _handleTranslate(
          `If you had to give it a rating out of ten (1-10), how would you rate it?`,
          `Kung kailangan mong bigyan ito ng rating sa sampu (1-10), paano mo ito ire-rate?`
        );

        setGetRateEmotion(true);
        setShowChatBox(false);
        // console.log("event");
        // setShowMoods(true);
        break;
      case "abc_explaining_c_type":
        setShowChatBox(true);
        setGetAfterFeelings(true);
        // _handleTypeToChatbox("after_feelings");
        // setShowMoods(false);
        break;
      case "explaining_b_get_thought_other_done":
        setMaxInput(0);
        setShowChatBox(false);
        // df_text_query(
        //   `Okay, um, before  we kind of leap into that, the idea of kind of challenging or getting curious about some of those thoughts.
        //   `,
        //   false,
        //   "bot"
        // );
        _handleTranslate(
          `Okay, um, before  we kind of leap into that, the idea of kind of challenging or getting curious about some of those thoughts.`,
          `Okay, ahhm, bago tayo pumunta doon, ang hamonin o pag-usisain patungkol sa isa sa mga kaisipang na ibahagi mo.`
        );
        _handleTranslate(
          `There's one more thing thing I wanted to do and that was to have a look and see if we could notice any of those 'unhelpful thinking styles'.`,
          `May bagay lang akong gustong gawin, at iyon ay tingnan kung mapapansin natin ang alin sa mga 'unhelpful thinking styles' na ito.`
        );
        // df_text_query(
        //   `There's one more thing thing I wanted to do and that was to have a look and see if we could notice any of those unhelpful thinking styles.
        //     `,
        //   false,
        //   "bot"
        // );
        _handleTranslate(
          `Now, I'm just going to show you this graphic interface about 'unhelpful thinking styles'.`,
          `Ngayon, ipapakita ko lang sa iyo ang graphic interface na ito patungkol sa 'unhelpful thinking styles'`
        );
        // df_text_query(
        //   `Now, I'm just going to show you this graphic interface about unhelpful thinking styles.
        //     `,
        //   false,
        //   "bot"
        // );

        _handleTranslate(
          `I want you to remember that these were the things that are really common when people are having problem and they start to think in these characteristic ways and some of them you'll notice happening for you a lot of the time and some not so much.`,
          `Nais kong tandaan mo na ito ang mga bagay na talagang karaniwan na iniisip, kapag ang mga tao ay nagkakaroon ng problema sila ay nagsisimulang mag-isip sa isa sa mga katangiang ito. At ang ilan sa mga ito ay mapapansin mong nangyayari sa iyo ng maraming beses at ang ilan ay hindi gaanong beses.`
        );
        // df_text_query(
        //   `I want you to remember that these were the things that are really common when people are having problem and they start to think in these characteristic ways and some of them you'll notice happening for you a lot of the time and some not so much.
        //     `,
        //   false,
        //   "bot"
        // );
        df_event_query("ABC_THOUGHT_DIARY_SHOW_UTS");
        setFocusThoughtDiaryLetter("b");
        // console.log(getOtherThoughtBool, "getOtherThoughtBool");
        // console.log(giveUTS, "giveUTS");
        // setMaxInput(0);
        // setGiveUTS(true);
        // _handleTypeToChatbox("after_feelings");
        // setShowMoods(false);
        break;
      case "explaining_b_get_uts":
        setShowUTS(true);

        // setGiveUTS(true);
        // setGetUTSAnswer()
        _handleTranslate(
          `I'm just wondering that when you look at these thoughts here: 
          '${_handleShowList(getOtherThoughtB)}'`,
          `Kapag tiningnan mo ang mga kaisipang ito dito: 
          '${_handleShowList(getOtherThoughtB)}'`
        );
        // df_text_query(
        //   `Kapag tiningnan mo ang mga kaisipang ito dito:
        //   '${_handleShowList(getOtherThoughtB)}'`,
        //   false,
        //   "bot"
        // );
        // df_text_query(
        //   `
        //   Is there any of those unhelpful thinking styles that pop out at you that will let you think. "Yeah I reckon that could be a bit of what's happening".

        //     `,
        //   false,
        //   "bot"
        // );
        _handleTranslate(
          `Is there any of those unhelpful thinking styles that pop out at you that will let you think. "Yeah I reckon that could be a bit of what's happening"`,
          `Mayroon bang isa sa mga 'unhelpful thinking styles' na nakita mo, na mapapaisip ka na: "Oo, sa palagay ko ito ang nangyayari sa akin."`
        );
        _handleTranslate(
          `Read the Description only for now, disregard the Disputation Questions.`,
          `Basahin muna ang deskripsyon sa ngayon, at huwag muna pansinin ang mga 'Disputation Questions'`
        );
        // df_text_query(
        //   `Read the Description only for now, disregard the Disputation Questions.`,
        //   false,
        //   "bot"
        // );
        _handleTranslate(
          `Are you ready to start identifying your unhelpful thinking styles?`,
          `Handa ka na bang simulan ang pagtukoy sa iyong mga 'unhelpful thinking styles'?`
        );
        // df_text_query(
        //   `Are you ready to start identifying your unhelpful thinking styles?`,
        //   false,
        //   "bot"
        // );

        df_event_query("ABC_THOUGHT_DIARY_SHOW_CONFIRM_UTS");
        setFocusThoughtDiaryLetter("b_uts");
        setShowChatBox(false);

        // _handleTypeToChatbox("after_feelings");
        // setShowMoods(false);
        break;
      case "explaining_b_confirm_uts":
        setGetUTSBool(true);
        setShowChatBox(false);
        // setGetUTS(true);
        _handleTranslate(
          `Click one of the Unhelpful Thinking Styles below!`,
          `Click one of the Unhelpful Thinking Styles below!`
        );
        // df_text_query(
        //   `Click one of the Unhelpful Thinking Styles below! `,
        //   false,
        //   "bot"
        // );
        break;
      // case "welcome-login":
      //   break;
      // case "welcome-continue":
      //   df_event_query("WELCOME_CONTINUE");
      //   break;

      // case "exit_ulayaw":
      // df_event_query("ABC_GETMOOD");

      // case "training_assessment-continue":
      //   break;

      // renderOneMessageStatic("code");
      // console.log("training_assessment captured");
      // setClaimCode(true);
      // break;
      // break;
      default:
        df_text_query(text, true, "user", text);
        break;
    }
  }

  function _handleAssessmentResult(total) {
    let res = "";
    if (total >= 7) res = "high";
    if (total < 7) res = "low";

    console.log("Assessment Result:", res, "Assessment Total:", total);

    // df_event_query("ASSESSMENT_DONE");
    df_event_query("ASSESSMENT_COMPANION");

    _handleTranslate(
      `Meron ka bang kasama ngayon? Ano ang kanyang pangalan?`,
      `Meron ka bang kasama ngayon? Ano ang kanyang pangalan?`,
      true
    );
    setClaimCode(false);
  }

  async function _handleMoodResult() {
    // df_text_query(_handleMoods(selectedMoods), false);
    // _handleTranslate(
    //   _handleTranslateEng(
    //     `base sa iyong napiling mood. Mayroon ka bang ideya kung kailan, saan at paano ito nagsimula?`
    //   ),
    //   `base sa iyong napiling mood. Mayroon ka bang ideya kung kailan, saan at paano ito nagsimula?`
    // );
    let inputData = `Base sa iyong napiling mood. Mayroon ka bang ideya kung kailan, saan at paano ito nagsimula?`;

    _handleTranslate(
      _handleMoods(selectedMoods),
      _handleMoods(selectedMoods),
      true
    );
    setShowChatBox(true);

    let ms = await _handleTranslateEng(inputData, true);
    _handleTranslate(`${ms}?`, inputData);
    // df_event_query("ABC_STEP1_MOOD_ASSESS");
    // _handleTranslate(
    //   `Do you have any ideas when these mood(s) first appeared?`,
    //   `Okay, mayroon ka bang idea kung kailan nagsimula mong maramdaman ang mga mood na ito?`
    // );

    setGetMoodStep1(true);
    // setShowMoods(false);
    // df_event_query("ASSESSMENT_DONE");
    // setClaimCode(false);
  }

  function _handleHotMoodResult() {
    setGetMoodHot(true);
    // df_text_query(_handleMoods(selectedMoods), false);
    _handleTranslate(
      `${_handleMoods(selectedMoods)}`,
      `${_handleMoods(selectedMoods)}`,
      true
    );
    df_event_query("ABC_THOUGHT_DIARY_C_OTHER_MOOD");
    _handleTranslate(
      `Is there anything else you've noticed? just in terms of how you felt in your body or any other feelings you experienced. Put 5 inputs. You can also type it in the chat box.`,
      `May napapansin ka pa ba? Sa kung ano ang naramdaman mo sa iyong katawan o kahit anumang damdamin na naranasan mo nung panahon na yun. Mag lagay ka ng 5 inputs. Pwede mo din e type ito sa chat box`
    );

    // setShowMoods(false);
    // df_event_query("ASSESSMENT_DONE");
    // setClaimCode(false);
  }

  function _handleOtherMoodResult() {
    setGetMoodOther(true);
    setShowMoodsOther(false);
    // df_text_query(_handleMoods(getOtherEmotionCAnswer), false);
    _handleTranslate(
      `${_handleMoods(getOtherEmotionCAnswer)}`,
      `${_handleMoods(getOtherEmotionCAnswer)}`,
      true
    );
    if (maxInput === 5) {
      setGetMoodOther(false);
      // df_text_query(_handleMoods(getOtherEmotionCAnswer), false);
      setMaxInput(0);
      df_event_query("ABC_THOUGHT_DIARY_C_AFTER_MOODS");
      _handleTranslate(
        `So what did you do after you experienced this feeling(s)?`,
        `Anong ginawa mo pagkatapos mong maranasan ang mga pakiramdam na ito?`
      );
      setShowChatBox(true);
    }
    // setShowMoods(false);

    // setClaimCode(false);
  }
  function _handleTypeToChatbox(type) {
    if (type === "emotions") {
      setShowChatBox(true);
      if (maxInput === 5) {
        setGetMoodOther(false);
        setMaxInput(0);
        df_event_query("ABC_THOUGHT_DIARY_C_AFTER_MOODS");
        _handleTranslate(
          `So what did you do after you experienced this feeling(s)?`,
          `Anong ginawa mo pagkatapos mong maranasan ang mga pakiramdam na ito?`
        );
      } else {
        setGetMoodOther(true);
      }
    }
    if (type === "thoughts") {
    }
    if (type === "for") {
    }
    if (type === "against") {
    }
  }

  function renderCards(cards) {
    return cards.map((card, i) => <Card key={i} payload={card.structValue} />);
  }

  function renderOneMessageStatic(message) {
    return (
      <div className=" rounded-lg  mb-2 text-sm ">
        <div>
          <div
            className={"flex justify-start space-x-2  p-2 rounded-lg bottom-0 "}
          >
            <div className={"flex justify-end flex-col"}>
              <div className=" rounded-full flex justify-center  text-white h-10 w-10  ">
                <img src={ulayawFace} />
                {/* <a href="/">{speaks}</a> */}
              </div>
            </div>

            <div
              className={
                "rounded-[10px] self-center overflow-ellipsis  px-4 py-2 bg-[#F2EFEF] text-black font-medium text-left"
              }
            >
              <label>{message}</label>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderOneMessage(message, i) {
    if (message.msg && message.msg.text && message.msg.text.text) {
      if (switchLanguage) {
        return (
          <Message
            key={i}
            speaks={message.speaks}
            text={message.msg.text.textFil}
          />
        );
      } else {
        return (
          <Message
            key={i}
            speaks={message.speaks}
            text={message.msg.text.text}
          />
        );
      }
    } else if (message.msg && message.msg.map) {
      return (
        <>
          <div className=" rounded-lg  mb-2 text-sm ">
            <div>
              <div
                className={
                  "flex justify-start space-x-2  p-2 rounded-lg bottom-0 "
                }
              >
                <div className={"flex justify-end flex-col"}>
                  <div className=" rounded-full flex justify-center  text-white h-10 w-10  ">
                    <img src={ulayawFace} />
                    {/* <a href="/">{speaks}</a> */}
                  </div>
                </div>

                <div
                  className={
                    "rounded-[10px] self-center overflow-ellipsis  px-4 py-2 space-y-4 space-x-2 bg-[#F2EFEF] text-black font-medium text-left h-[420px] flex flex-col justify-evenly"
                  }
                >
                  <label className="text-center ">{message.msg.map.text}</label>

                  <span className=" h-[350px] w-[350px] relative">
                    <MapContainer
                      lat={message.msg.map.latitude}
                      lng={message.msg.map.longitude}
                    />
                  </span>

                  {/* <iframe
                    width="350"
                    height="350"
                    loading="lazy"
                    allowfullscreen
                    // view mode
                    src={`https://www.google.com/maps/embed/v1/view?key=${message.msg.map.key}&center=${message.msg.map.latitude},${message.msg.map.longitude}&zoom=18&maptype=satellite`}

                    // view mode
                    // src={`https://www.google.com/maps/embed/v1/view?key=${message.msg.map.key}&center=7.152694784312385,125.60000875362125&zoom=18&maptype=satellite`}

                    // place mode
                    // src="https://www.google.com/maps/embed/v1/place?key=AIzaSyA6hz3_zGUdW-B6RrjX1zi2nKVfM9sRyjg&q=Space+Needle,Seattle+WA"

                    // streetview mode
                    // src={`https://www.google.com/maps/embed/v1/streetview?key=${message.msg.map.key}&location=${message.msg.map.latitude},${message.msg.map.longitude}&heading=210&pitch=10&fov=35`}
                  ></iframe> */}
                </div>
              </div>
            </div>
          </div>
        </>
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
        <>
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
          {/* {console.log(message)} */}
        </>
      );
    } else if (
      message.msg &&
      message.msg.payload &&
      message.msg.payload.fields &&
      message.msg.payload.fields.quick_replies_welcome &&
      quickRepliesWelcome
    ) {
      return (
        <>
          {quickRepliesWelcome ? (
            <div
              className={
                "flex justify-center space-x-2  p-2 rounded-lg bottom-0 "
              }
            >
              <div
                className={
                  "rounded-[10px] self-center overflow-ellipsis  px-4 py-2  text-black font-medium text-left "
                }
              >
                <span className="flex flex-wrap">
                  <a
                    style={{ margin: 3 }}
                    onClick={() => {
                      // df_text_query("Show Thought Diary", false);
                      setQuickRepliesWelcome(false);
                      setShowChatBox(false);
                      setShowModalLogin(true);
                    }}
                    className="bg-[#F2EFEF] rounded-full  p-2 px-4 self-center h-10 cursor-pointer"
                  >
                    Login
                  </a>
                  {/* <a
                    style={{ margin: 3 }}
                    onClick={() => {
                      // df_text_query("Show Thought Diary", false);
                      setQuickRepliesWelcome(false);
                      setShowChatBox(true);
                      df_text_query("Magpatuloy", false);
                      df_event_query("WELCOME_CONTINUE");
                      // setShowChatBox(true);
                    }}
                    className="bg-[#F2EFEF] rounded-full  p-2 px-4 self-center h-10 cursor-pointer"
                  >
                    Magpatuloy
                  </a> */}
                </span>
              </div>
            </div>
          ) : (
            ""
          )}

          {showThoughtDiaryTool
            ? renderOneMessageStatic(
                "You might want to have a look at this tool to get a better sense of what it's all about. But I will walk you through it."
              )
            : ""}

          {showThoughtDiaryTool ? (
            <div>
              <QuickReplies
                text={
                  message.msg.payload.fields.text
                    ? message.msg.payload.fields.text
                    : null
                }
                key={i}
                replyClick={_handleQuickReplyPayload}
                speaks={message.speaks}
                payload={message.msg.payload.fields.show_diary.listValue.values}
                // dontShowChatBox={true}
              />
            </div>
          ) : (
            ""
          )}
        </>
      );
    } else if (
      message.msg &&
      message.msg.payload &&
      message.msg.payload.fields &&
      message.msg.payload.fields.multiple_choice &&
      correctCode
    ) {
      // return renderOneMessageStatic("Tama ang code congrats!");
      return (
        <>
          <MultipleChoice
            key={i}
            _handleAssessmentResult={_handleAssessmentResult}
            speaks={message.speaks}
            payload={
              message.msg.payload.fields.multiple_choice.listValue.values
            }
            setAssessmentScore={setAssessmentScore}
            assessmentScore={assessmentScore}
            toast={toast}
          />
        </>
      );
    } else if (
      message.msg &&
      message.msg.payload &&
      message.msg.payload.fields &&
      message.msg.payload.fields.multiple_choice
    ) {
      // new code input
      if (!claimCode) {
        setClaimCode(true);
      }

      return renderOneMessageStatic("Paki lagay ng code");
    } else if (
      message.msg &&
      message.msg.payload &&
      message.msg.payload.fields &&
      message.msg.payload.fields.get_mood
    ) {
      return (
        <>
          <GetMoods
            key={i}
            _handleMoodResult={_handleMoodResult}
            hotEmotion={true}
            speaks={message.speaks}
            payload={message.msg.payload.fields.get_mood.listValue.values}
            selectedMoods={selectedMoods}
            setSelectedMoods={setSelectedMoods}
            showAtEntrance={true}
            // setAssessmentScore={setAssessmentScore}
            // assessmentScore={assessmentScore}
          />
        </>
      );
    } else if (
      message.msg &&
      message.msg.payload &&
      message.msg.payload.fields &&
      message.msg.payload.fields.mood_assess &&
      getMoodStep1
    ) {
      return (
        <>
          {/* {getMoodStep1
            ? renderOneMessageStatic(
                "Do you have any ideas when these mood(s) first appeared?"
              )
            : ""} */}

          {/* {renderOneMessageStatic(
            message.msg.payload.fields.mood_assess_text.stringValue
          )} */}
          <QuickReplies
            text={""}
            key={i}
            replyClick={_handleQuickReplyPayload}
            onChange={() => {
              setShowThoughtDiaryTool(true);
            }}
            speaks={message.speaks}
            payload={message.msg.payload.fields.mood_assess.listValue.values}
            showDiary={true}
          />
          {/* {console.log(message)} */}
        </>
      );
    } else if (
      message.msg &&
      message.msg.payload &&
      message.msg.payload.fields &&
      message.msg.payload.fields.show_diary
    ) {
      return (
        <>
          {/* {renderOneMessageStatic(
            "Do you have any ideas when these mood(s) first appeared?"
          )} */}

          {!showThoughtDiaryTool ? (
            <div
              className={
                "flex justify-center space-x-2  p-2 rounded-lg bottom-0 "
              }
            >
              <div
                className={
                  "rounded-[10px] self-center overflow-ellipsis  px-4 py-2  text-black font-medium text-left "
                }
              >
                <span className="flex flex-wrap">
                  <a
                    style={{ margin: 3 }}
                    onClick={() => {
                      // df_text_query("Show Thought Diary", false);
                      _handleTranslate(
                        `Show Thought Diary`,
                        `Show Thought Diary`,
                        true
                      );
                      setShowThoughtDiaryTool(true);
                      df_event_query("ABC_THOUGHT_DIARY_EXPLAINING_A");
                      _handleTranslate(
                        `So keep in mind that the A) part is where we just write down what happened.`,
                        `Tandaan na ang A) na bahagi ay kung saan isusulat lang natin ang nangyari.`
                      );
                      _handleTranslate(
                        `So, when you mention "${getMoodWhenStartedStep1}", what time and place do you think you first noticed the change in your mood? What are you ${_handleMoods(
                          getHotEmotionCAnswer
                        )}? What makes you feel ${_handleMoods(
                          getHotEmotionCAnswer
                        )}? When did it happen? Do you remember where it happened?`,
                        `Kapag sinabi mong  "${getMoodWhenStartedStep1}", sa anong oras at lugar sa tingin mo nung una mong napansin ang pagbabago sa iyong mood? Bakit at sa anong dahilan ka ${_handleMoods(
                          getHotEmotionCAnswer
                        )}? Kailan at saan to nagsimula? Naaalala mo ba kung saang lugar ito nagsimula?`
                      );
                      setFocusThoughtDiaryLetter("a");
                      setShowChatBox(true);
                    }}
                    className="bg-[#F2EFEF] rounded-full  p-2 px-4 self-center h-10 cursor-pointer"
                  >
                    Show Thought Diary
                  </a>
                </span>
              </div>
            </div>
          ) : (
            ""
          )}

          {/* {showThoughtDiaryTool
            ? renderOneMessageStatic(
                "You might want to have a look at this tool to get a better sense of what it's all about. But I will walk you through it."
              )
            : ""} */}

          {/* {showThoughtDiaryTool ? (
            <div>
              <QuickReplies
                text={
                  message.msg.payload.fields.text
                    ? message.msg.payload.fields.text
                    : null
                }
                key={i}
                replyClick={_handleQuickReplyPayload}
                speaks={message.speaks}
                payload={message.msg.payload.fields.show_diary.listValue.values}
                // dontShowChatBox={true}
              />
            </div>
          ) : (
            ""
          )} */}
        </>
      );
    } else if (
      message.msg &&
      message.msg.payload &&
      message.msg.payload.fields &&
      message.msg.payload.fields.agree_a
    ) {
      return (
        <>
          {/* {renderOneMessageStatic(
            `So, when you mention ${getMoodWhenStartedStep1}, what time and place do you think you first noticed the change in your mood? What makes you feel ${_handleMoods(
              getHotEmotionCAnswer
            )}? When did it happen? Can you recall where it occur?`
          )} */}

          {/* {renderOneMessageStatic(
            `Answer this question: 
            ${" "} Was it yesterday? last week? last month? last year? last decade? When did it occur? at school? at work? at home? while playing? while working?  `
          )} */}

          {activateGetAdverseStep3 === 0 ? setActivateGetAdverseStep3(1) : ""}

          {activateGetAdverseStep3 === 2 && !switchLanguage
            ? renderOneMessageStatic(
                `Okay I got your answer here.'${getAdverseStep3UseState}'`
              )
            : ""}
          {activateGetAdverseStep3 === 2 && switchLanguage
            ? renderOneMessageStatic(
                `Okay, nakuha ko yung sinagot mo. '${getAdverseStep3UseState}'`
              )
            : ""}

          {activateGetAdverseStep3 === 2 ? (
            <div
              className={
                "flex justify-center space-x-2  p-2 rounded-lg bottom-0 "
              }
            >
              <div
                className={
                  "rounded-[10px] self-center overflow-ellipsis  px-4 py-2  text-black font-medium text-left "
                }
              >
                <span className="flex flex-wrap">
                  <a
                    style={{ margin: 3 }}
                    onClick={() => {
                      _handleTranslate(
                        getAdverseStep3UseState,
                        getAdverseStep3UseState,
                        true
                      );
                      // df_text_query(getAdverseStep3UseState, false);
                      df_event_query("ABC_THOUGHT_DIARY_EXPLAINING_C");
                      _handleTranslate(
                        `Okay, so what was that change in your mood that you noticed?  So now I'm in the C) part, which is about the consequences or how you felt afterwards.`,
                        `Okay, ano ang pagbabago sa iyong mood na napansin mo? Ngayon ako ay nasa C) na bahagi, na tungkol sa mga kahihinatnan o kung ano ang naramdaman mo pagkatapos.                       `
                      );

                      _handleTranslate(
                        `I want to determine your "Hot Emotion" or what you felt after what you said in the A) part. The exact mood that you thought during those time.`,
                        `Gusto kong malaman yung "Hot Emotion" o kung ano yung mood mo pagkatapos ng sinabi mo sa A) na bahagi. Yuung eksaktong naramdaman mo noong panahon na yun.`
                      );
                      _handleTranslate(
                        `So you mentioned earlier about your present mood: '${_handleMoods(
                          getHotEmotionCAnswer
                        )}'`,
                        `Na mention mo kanina sa akin yung present mood mo: '${_handleMoods(
                          getHotEmotionCAnswer
                        )}'`
                      );
                      _handleTranslate(
                        `Is it still the ones you feel when we go back to the time after you said this: '${getAdverseStep3UseState}' or is your mood different back then? If yes can you identify your mood back then again for me?`,
                        `Ito pa rin ba ang nararamdaman mo kapag bumalik tayo sa panahon pagkatapos mong sabihin ito? '${getAdverseStep3UseState}' `
                      );
                      setActivateGetAdverseStep3(3);
                      setGetAdverseStep3(getAdverseStep3UseState);

                      setFocusThoughtDiaryLetter("c");
                      setShowChatBox(false);
                    }}
                    className="bg-[#F2EFEF] rounded-full  p-2 px-4 self-center h-10 cursor-pointer"
                  >
                    Now, click here to write it on the thought diary.
                  </a>
                </span>
              </div>
            </div>
          ) : (
            ""
          )}
        </>
      );
    } else if (
      message.msg &&
      message.msg.payload &&
      message.msg.payload.fields &&
      message.msg.payload.fields.get_mood_hot
    ) {
      return (
        <>
          {/* {renderOneMessageStatic(
            `So you mentioned earlier about your present mood(s): '${_handleMoods(
              getHotEmotionCAnswer
            )}' `
          )} */}

          {/* {renderOneMessageStatic(
            `Is it still the ones you feel when we go back to the time after you said this: '${getAdverseStep3}' or is your mood different back then? If yes can you identify your mood back then again for me? `
          )} */}

          {!getMoodHot ? (
            <div
              className={
                "flex justify-center space-x-2  p-2 rounded-lg bottom-0 "
              }
            >
              <div
                className={
                  "rounded-[10px] self-center overflow-ellipsis  px-4 py-2  text-black font-medium text-left "
                }
              >
                <span className="flex flex-wrap">
                  <a
                    style={{ margin: 3 }}
                    onClick={() => {
                      setShowMoodsHot(true);
                      // console.log(getHotEmotionCAnswer, "different mood");
                    }}
                    className="bg-[#F2EFEF] rounded-full  p-2 px-4 self-center h-10 cursor-pointer"
                  >
                    Different Mood
                  </a>
                  <a
                    style={{ margin: 3 }}
                    onClick={() => {
                      // console.log(getHotEmotionCAnswer, "same mood");
                      _handleHotMoodResult();
                      setShowMoodsHot(false);
                    }}
                    className="bg-[#F2EFEF] rounded-full  p-2 px-4 self-center h-10 cursor-pointer"
                  >
                    Same Mood
                  </a>
                </span>
              </div>
            </div>
          ) : (
            ""
          )}

          {showMoodsHot ? (
            <GetMoods
              key={i}
              hotEmotion={true}
              _handleMoodResult={_handleHotMoodResult}
              speaks={message.speaks}
              payload={message.msg.payload.fields.get_mood_hot.listValue.values}
              selectedMoods={selectedMoods}
              setSelectedMoods={setSelectedMoods}
              showAtEntrance={showMoodsHot}
              // dontShowChatBox={true}
              // setAssessmentScore={setAssessmentScore}
              // assessmentScore={assessmentScore}
            />
          ) : (
            ""
          )}
        </>
      );
    } else if (
      message.msg &&
      message.msg.payload &&
      message.msg.payload.fields &&
      message.msg.payload.fields.get_mood_other &&
      getMoodHot
    ) {
      return (
        <>
          <div
            className={
              "flex justify-center space-x-2  p-2 rounded-lg bottom-0 "
            }
          >
            <div
              className={
                "rounded-[10px] self-center overflow-ellipsis  px-4 py-2  text-black font-medium text-left "
              }
            >
              {maxInput != 5 && getOtherEmotionAll.length < 5 ? (
                <span className="flex flex-wrap">
                  {!showMoodsOther ? (
                    <a
                      style={{ margin: 3 }}
                      onClick={() => {
                        setShowMoodsOther(!showMoodsOther);
                        // console.log(getHotEmotionCAnswer, "different mood");
                      }}
                      className="bg-[#F2EFEF] rounded-full  p-2 px-4 self-center h-10 cursor-pointer"
                    >
                      Show Emotions
                    </a>
                  ) : (
                    ""
                  )}

                  <a
                    style={{ margin: 3 }}
                    onClick={() => {
                      // _handleOtherMoodResult();
                      _handleTypeToChatbox("emotions");
                    }}
                    className="bg-[#F2EFEF] rounded-full  p-2 px-4 self-center h-10 cursor-pointer"
                  >
                    Type to chatbox
                  </a>
                </span>
              ) : (
                ""
              )}
            </div>
          </div>
          {showMoodsOther ? (
            <GetMoods
              key={i}
              otherEmotion={true}
              _handleMoodResult={_handleOtherMoodResult}
              speaks={message.speaks}
              payload={
                message.msg.payload.fields.get_mood_other.listValue.values
              }
              selectedMoods={selectedMoods}
              setSelectedMoods={setSelectedMoods}
              showAtEntrance={showMoodsOther}
              // setAssessmentScore={setAssessmentScore}
              // assessmentScore={assessmentScore}
            />
          ) : (
            ""
          )}
        </>
      );
    } else if (
      message.msg &&
      message.msg.payload &&
      message.msg.payload.fields &&
      message.msg.payload.fields.rate_emotion
    ) {
      return (
        <>
          {/* {console.log(getRateEmotion, "waw sadsad")} */}

          {/* {renderOneMessageStatic(`Okay, so I understand that you've had to
              deal with a lot of the consequences. However, these are only a few
              of the ones I noted. '${_handleMoods(getHotEmotionCAnswer)}' and
              '${_handleShowList(getOtherEmotionAll)}'`)}
          {getAfterFeelings
            ? renderOneMessageStatic(`And you did this after experiencing the
              consequences.'${getAfterFeelingsChat}'`)
            : ""} */}
          {/* {renderOneMessageStatic(
            `Okay, so that '${_handleMoods(
              getHotEmotionCAnswer
            )}' feeling, um... When you say you felt it ${getMoodWhenStartedStep1} give me an idea of how strong it was.`
          )} */}
          {/* {renderOneMessageStatic(
            `If you had to give it a rating out of ten (1-10), how would you rate it?`
          )} */}
        </>
      );
    } else if (
      message.msg &&
      message.msg.payload &&
      message.msg.payload.fields &&
      message.msg.payload.fields.show_uts
    ) {
      return (
        <>
          <QuickReplies
            text={
              message.msg.payload.fields.show_uts.stringValue
                ? message.msg.payload.fields.show_uts.stringValue
                : null
            }
            key={i}
            replyClick={_handleQuickReplyPayload}
            // onChange={() => {
            //   setShowThoughtDiaryTool(true);
            // }}
            speaks={message.speaks}
            payload={message.msg.payload.fields.show_uts.listValue.values}
            showUTS={true}
          />
          {/* {console.log(message)} */}
        </>
      );
    } else if (
      message.msg &&
      message.msg.payload &&
      message.msg.payload.fields &&
      message.msg.payload.fields.select_UTS_thought &&
      getUTSThoughtBool
    ) {
      return (
        <div
          className={"flex justify-center space-x-2  p-2 rounded-lg bottom-0 "}
        >
          <div
            className={
              "rounded-[10px] self-center overflow-ellipsis  px-4 py-2  text-black font-medium text-left "
            }
          >
            <span className="flex flex-wrap">
              {getOtherThoughtB.map((item, i) => {
                if (getUTSContainerState.length != 0) {
                  if (!getUTSContainerState.includes(item)) {
                    return (
                      <a
                        style={{ margin: 3 }}
                        onClick={() => {
                          _handleUTSQuickReply(item, i);
                        }}
                        className="bg-[#F2EFEF] rounded-full  p-2 px-4 self-center h-10 cursor-pointer"
                      >
                        {item}
                      </a>
                    );
                  }
                } else {
                  return (
                    <a
                      style={{ margin: 3 }}
                      onClick={() => {
                        _handleUTSQuickReply(item, i);
                      }}
                      className="bg-[#F2EFEF] rounded-full  p-2 px-4 self-center h-10 cursor-pointer"
                    >
                      {item}
                    </a>
                  );
                }
              })}
            </span>
          </div>
        </div>
      );
    } else if (
      message.msg &&
      message.msg.payload &&
      message.msg.payload.fields &&
      message.msg.payload.fields.select_HOT_thought &&
      getHotThoughtBool
    ) {
      return (
        <div
          className={"flex justify-center space-x-2  p-2 rounded-lg bottom-0 "}
        >
          <div
            className={
              "rounded-[10px] self-center overflow-ellipsis  px-4 py-2  text-black font-medium text-left "
            }
          >
            <span className="flex flex-wrap">
              {getOtherThoughtB.map((item, i) => {
                return (
                  <a
                    style={{ margin: 3 }}
                    onClick={() => {
                      _handleHotThoughtQuickReply(item, i);
                    }}
                    className="bg-[#F2EFEF] rounded-full  p-2 px-4 self-center h-10 cursor-pointer"
                  >
                    {item}
                  </a>
                );
              })}
            </span>
          </div>
        </div>
      );
    } else if (
      message.msg &&
      message.msg.payload &&
      message.msg.payload.fields &&
      message.msg.payload.fields.explain_d &&
      getExplainDBool
    ) {
      return (
        <>
          <div
            className={
              "flex justify-center space-x-2  p-2 rounded-lg bottom-0 "
            }
          >
            <div
              className={
                "rounded-[10px] self-center overflow-ellipsis  px-4 py-2  text-black font-medium text-left "
              }
            >
              <span className="flex flex-wrap">
                <a
                  style={{ margin: 3 }}
                  onClick={() => {
                    _handleExplainDQuickReply();
                  }}
                  className="bg-[#F2EFEF] rounded-full  p-2 px-4 self-center h-10 cursor-pointer"
                >
                  Okay, continue.
                </a>
              </span>
            </div>
          </div>
        </>
      );
    } else if (
      message.msg &&
      message.msg.payload &&
      message.msg.payload.fields &&
      message.msg.payload.fields.explain_d_get_for_1 &&
      getExplainDBool
    ) {
      return (
        <>
          <div
            className={
              "flex justify-center space-x-2  p-2 rounded-lg bottom-0 "
            }
          >
            <div
              className={
                "rounded-[10px] self-center overflow-ellipsis  px-4 py-2  text-black font-medium text-left "
              }
            >
              <span className="flex flex-wrap">
                <a
                  style={{ margin: 3 }}
                  onClick={() => {
                    _handleExplainDQuickReply();
                  }}
                  className="bg-[#F2EFEF] rounded-full  p-2 px-4 self-center h-10 cursor-pointer"
                >
                  Okay I've seen the Disputation Questions
                </a>
              </span>
            </div>
          </div>
        </>
      );
    } else if (
      message.msg &&
      message.msg.payload &&
      message.msg.payload.fields &&
      message.msg.payload.fields.explain_d_get_against_1 &&
      getExplainDBool
    ) {
      return (
        <>
          <div
            className={
              "flex justify-center space-x-2  p-2 rounded-lg bottom-0 "
            }
          >
            <div
              className={
                "rounded-[10px] self-center overflow-ellipsis  px-4 py-2  text-black font-medium text-left "
              }
            >
              <span className="flex flex-wrap">
                <a
                  style={{ margin: 3 }}
                  onClick={() => {
                    _handleExplainDQuickReply();
                  }}
                  className="bg-[#F2EFEF] rounded-full  p-2 px-4 self-center h-10 cursor-pointer"
                >
                  Okay
                </a>
              </span>
            </div>
          </div>
        </>
      );
    } else if (
      message.msg &&
      message.msg.payload &&
      message.msg.payload.fields &&
      message.msg.payload.fields.explain_d_get_d_q &&
      getExplainDBool
    ) {
      return (
        <>
          <div
            className={
              "flex justify-center space-x-2  p-2 rounded-lg bottom-0 "
            }
          >
            <div
              className={
                "rounded-[10px] self-center overflow-ellipsis  px-4 py-2  text-black font-medium text-left "
              }
            >
              <span className="flex flex-wrap">
                <a
                  style={{ margin: 3 }}
                  onClick={() => {
                    _handleExplainDQuickReply();
                  }}
                  className="bg-[#F2EFEF] rounded-full  p-2 px-4 self-center h-10 cursor-pointer"
                >
                  Okay I've seen the Disputation Questions
                </a>
              </span>
            </div>
          </div>
        </>
      );
    }

    //  else if (
    //   message.msg &&
    //   message.msg.payload &&
    //   message.msg.payload.fields &&
    //   message.msg.payload.fields.quick_replies
    // ) {
    // }
  }

  function _handleMap() {
    return <MapContainer />;
  }

  function _handleMoods(moodContainer) {
    let res = "";
    let firstHit = -1;
    for (let i = 0; i < moodContainer.length; i++) {
      if (moodContainer[i].select && firstHit === -1) {
        firstHit = i;
      }
      if (moodContainer[i].select && i != firstHit) {
        res += ",";
      }
      if (moodContainer[i].select) {
        res += moodContainer[i].mood_text;
      }
    }
    res += ".";
    return res;
  }

  function _handleShowList(listContainer) {
    return listContainer.map((item, i) => {
      let res = "";
      if (item != undefined) {
        res += item;
      }

      return res;
    });
  }
  function _handleUTSMean() {
    if (getUTS === "Mental Filter") {
      df_text_query(
        `So, this could indicate that you were focusing only on one part of a situation and ignoring the rest. Usually this means looking at the negative parts of a situation and forgetting the positive parts, and the whole picture is coloured by what may be a single negative detail.`,
        false,
        "bot"
      );
    }
    if (getUTS === "Jumping to Conclusions") {
      df_text_query(
        `So, this could imply that you assume that you know what someone else is thinking (mind reading) and when you make predictions about what is going to  happen in the future (predictive thinking)`,
        false,
        "bot"
      );
    }
    if (getUTS === "Personalisation") {
      df_text_query(
        `So then that might kind of give us a bit of an idea that you were blaming yourself for everything that goes wrong or could go wrong, even when you may only be partly responsible or not responsible at all. You might be taking 100 per cent responsibility for the occurrence of external events`,
        false,
        "bot"
      );
    }
    if (getUTS === "Catastrophising") {
      df_text_query(
        `So that may give us a hint as to why we see the situation as terrible, awful, dreadful, and horrible, despite the fact that the problem is quite minor.`,
        false,
        "bot"
      );
    }
    if (getUTS === "Black and white thinking") {
      df_text_query(
        `So, this could imply that you were only seeing one extreme or the other. You are either incorrect or correct, good or bad, and so on. There are no shades of grey or in-betweens.`,
        false,
        "bot"
      );
    }
    if (getUTS === "Shoulding and musting") {
      df_text_query(
        `So, this could indicate that sometimes by saying “I should…” or “I must…” you can put unreasonable demands or pressure on yourself and others. Although these statements are not always unhelpful – for example “I should not get drunk and drive home” – they can sometimes create unrealistic expectations.`,
        false,
        "bot"
      );
    }
    if (getUTS === "Overgeneralisation") {
      df_text_query(
        `So, this could imply that you take a single incident from the past or present and apply it to all current or future situations. If you say "you always...", "everyone...", or "I never...", you're probably overgeneralizing.`,
        false,
        "bot"
      );
    }
    if (getUTS === "Labelling") {
      df_text_query(
        `So, this could imply that you label yourself and others when making broad statements based on behavior in specific situations. You could use this label despite the fact that there are far more cases that are inconsistent with it.`,
        false,
        "bot"
      );
    }
    if (getUTS === "Emotional reasoning") {
      df_text_query(
        `So, this could indicate that you were basing your view of situations or yourself on the way you are feeling. For example, the only evidence that something bad is going to happen is that you feel like something bad is going to happen.`,
        false,
        "bot"
      );
    }
    if (getUTS === "Magnification and minimisation") {
      df_text_query(
        `So, this could indicate that you you magnify or exaggerate the positive attributes of other people and minimise your own positive attributes. It’s as though you’re explaining away your own positive characteristics.`,
        false,
        "bot"
      );
    }
  }

  function _handleHotThoughtQuickReply(item, i) {
    df_text_query(item, false, "user");

    setShowChatBox(true);
    setGetHotThoughtB([item]);
    df_text_query(
      "Okay, I see. That's the one we are going to focus on.",
      false,
      "bot"
    );
    df_text_query(
      `How much do you believe that this is the one that is most likely connected with your emotions? ${item}`,
      false,
      "bot"
    );
    df_text_query(
      `If you had to rate it out of a hundred say like a percentage: 1-100%`,
      false,
      "bot"
    );
    df_text_query(
      `Greater than 50% is considered to be worse, while less than 50% is considered to be slightly better.`,
      false,
      "bot"
    );

    setGetRateThought(true);
    setGetHotThoughtBool(false);
  }

  function _handleExplainDQuickReply() {
    if (maxInput === 0) {
      df_text_query(
        `Um, so I think this is really gonna be worth working on. So now we are going to move on to D) part of the thought diary. `,
        false,
        "bot"
      );

      df_text_query(
        `So this bit is called D) for disputation. So this is the section where we try to be a bit curios about the thoughts rather than just taking them to be facts. `,
        false,
        "bot"
      );

      df_text_query(
        `We're going to check them out a little bit. And so the first bit as you can see on the thought diary, it's looking at evidence for and against. So is there any evidence for the thought and is there any evidence against the thought.`,
        false,
        "bot"
      );
      df_text_query(
        `So if we can take a look at the graphic if you can hover one of the Unhelpful Thinking Styles, you can see the Disputation Questions.`,
        false,
        "bot"
      );
      df_event_query("ABC_THOUGHT_EXPLAIN_D_GET_FOR_1");
    }
    if (maxInput === 1) {
      df_text_query(
        `So we'll start with for. These ones you probably find are coming to mind pretty easy. `,
        false,
        "bot"
      );
      df_text_query(
        `So I'm just gonna focus on the for. And then tell me what would be your sort of your main reasons in choosing this belief: "${getHotThoughtB[0]}"`,
        false,
        "bot"
      );
      df_text_query(
        `What leads you to think this way? For how long do you think you were having this belief? days? weeks? months? or even years?
         
        Try to be as factual as possible`,
        false,
        "bot"
      );
      setShowChatBox(true);
    }
    if (maxInput === 2) {
      df_text_query(
        `Okay, I can imagine that would be the main piece of evidence. Is there other things that you would see as evidence for this belief: "${getHotThoughtB[0]}"`,
        false,
        "bot"
      );
      df_text_query(
        `Is there anything new that has happened recently? `,
        false,
        "bot"
      );

      setShowChatBox(true);
    }

    if (maxInput === 4) {
      df_text_query(
        `Um, So maybe we can have a look at some of the evidence in "against" just to see if there is anything that doesn't quite fit with this belief. 
        
        `,
        false,
        "bot"
      );
      df_text_query(
        `So this is the bit where we need to be really really fair and not cover all things out before we've put them up. 
        
        `,
        false,
        "bot"
      );
      df_text_query(
        `We're looking for any piece of evidence, it doesn't quite fit with this really really strong belief. `,
        false,
        "bot"
      );
      df_text_query(
        `So is there anything, any experiences you've had, anything so you know to be true that don't quite fit with the belief: "${getHotThoughtB[0]}"`,
        false,
        "bot"
      );
      df_text_query(
        `The opposite of this belief? When was the last time you didn't have a problem with this belief?`,
        false,
        "bot"
      );
      setShowChatBox(true);
    }

    if (maxInput === 5) {
      df_text_query(
        `Okay, so tell me more about that "${getAgainstEvidenceD[0]}"`,
        false,
        "bot"
      );
      df_text_query(
        `What have you noticed about the pattern of your mood um, during those times.
        
        `,
        false,
        "bot"
      );
      setShowChatBox(true);
    }

    if (maxInput === 6) {
      df_text_query(
        `And have you noticed any of these mood patterns happening recently? "${getAgainstEvidenceD[1]}"`,
        false,
        "bot"
      );
      df_text_query(
        `How frequently you get this mood patterns over the last few weeks? Try and specify what time? Answer the question Is it this week? last week? or the other week?
        `,
        false,
        "bot"
      );
      setShowChatBox(true);
    }

    if (maxInput === 7) {
      df_text_query(
        `So I'm wondering is there been any sort of changes or periods where you haven't getting this belief over the last few years? "${getHotThoughtB[0]}"`,
        false,
        "bot"
      );
      df_text_query(
        `I want you to think of a place and time where you haven't getting this belief and what did you feel during those times?
        `,
        false,
        "bot"
      );
      setShowChatBox(true);
    }

    if (maxInput === 8) {
      df_text_query(
        `Okay, how long did it last for that year, you think you weren't getting this belief? "${getHotThoughtB[0]}"`,
        false,
        "bot"
      );
      df_text_query(
        `if we could go back to the time and place when you said: "${getAgainstEvidenceD[3]}"
        `,
        false,
        "bot"
      );
      setShowChatBox(true);
    }

    if (maxInput === 9) {
      df_text_query(
        `Okay and I'm wondering as well if you experienced this belief before? "${getHotThoughtB[0]}"`,
        false,
        "bot"
      );
      df_text_query(
        `And what happened there? how did you face this belief back then?
        `,
        false,
        "bot"
      );
      setShowChatBox(true);
    }

    if (maxInput === 10) {
      df_text_query(
        `So you experienced this problem that you have when we go back to the time and place when you said:"${getAgainstEvidenceD[5]}"`,
        false,
        "bot"
      );
      df_text_query(
        `Can you say that you overcome this problem? if not how did you got through it? did you came out of it? did you recovered from it? did it went away? What would you say?
        `,
        false,
        "bot"
      );
      setShowChatBox(true);
    }

    if (maxInput === 11) {
      df_text_query(
        `Um, is there anything else that you can think of that kind of would be evidence in "against" that doesn't quite fit with this belief: "${getHotThoughtB[0]}"`,
        false,
        "bot"
      );
      df_text_query(
        `Maybe a friend of your's that have overcome this kind of problem? or have you seen other people get through this kind of problem?
        `,
        false,
        "bot"
      );

      setShowChatBox(true);
    }
    if (maxInput === 12) {
      df_text_query(
        `So earlier you come up with: "${getUTSContainer.map((item, i) => {
          // console.log(getUTSContainer)
          return (
            <>
              {item.title}
              {i != getUTSContainer.length - 1 ? "," : "."}
            </>
          );
        })}"`,
        false,
        "bot"
      );
      df_text_query(
        `So this one "${
          getHotThoughtB[0]
        }" we've really identified as "${getUTSContainer.map((item, i) => {
          if (getHotThoughtB[0] === item.thought) {
            return item.title;
          }
        })}"
        `,
        false,
        "bot"
      );

      df_text_query(
        `So what does it say there about what might be good strategy for that unhelpful thinking style can you have a look?
        `,
        false,
        "bot"
      );
      df_text_query(
        `Okay, so why don't we try those. So the first question was "how do I know this?" what is your basis for thinking this?
        `,
        false,
        "bot"
      );

      setShowChatBox(true);
    }

    setMaxInput(maxInput + 1);
    setFocusThoughtDiaryLetter("d");
  }
  function _handleUTSQuickReply(item, i) {
    df_text_query(item, false, "user");
    let UTSformat = { title: getUTS, thought: item };
    if (getUTSContainerState.length === 0) {
      setGetUTSCointainerState([item]);
      setGetUTSCointainer([UTSformat]);
    } else {
      setGetUTSCointainerState((x) => {
        return [...getUTSContainerState, item];
      });
      setGetUTSCointainer((prev) => {
        return [...prev, UTSformat];
      });
      // console.log(getUTSContainerState, "utsCont");
    }

    df_text_query(
      `Okay this one "${item}" we've noticed might be as "${getUTS}" `,
      false,
      "bot"
    );
    _handleUTSMean();

    let res = [];
    res = getOtherThoughtB.map((x, i) => {
      console.log(x, "x");
      // if (x != item) {
      //   return x;
      // }
      if (getUTSContainerState.length === 0) {
        if (x != item) {
          return x;
        }
      } else {
        if (!getUTSContainerState.includes(x)) {
          return x;
        }
      }
    });
    setGetUTSThoughtBool(false);

    if (maxInput != 3) {
      df_text_query(
        `Is there anything else in this list that matches one of those unhelpful thinking styles: 
        '${_handleShowList(res)}'
        (you can reuse the one you chose earlier)" `,
        false,
        "bot"
      );
      df_text_query(
        `Click one of the Unhelpful Thinking Styles below! `,
        false,
        "bot"
      );
      setGetUTSState(true);
      setMaxInput(maxInput + 1);
    } else {
      df_text_query(
        `Um, so we've picked up on a couple of those unhelpful thinking styles and that might start us thinking: "maybe there is a bit of that distorted or biased thinking happening here"  `,
        false,
        "bot"
      );
      df_text_query(
        `One final thing then is to think about which of these thoughts we've got here: ${_handleShowList(
          getOtherThoughtB
        )}`,
        false,
        "bot"
      );

      df_text_query(
        `Is the one that really links up to these feelings C) column`,
        false,
        "bot"
      );
      df_text_query(
        `So the idea here is, we try and find the hot thought. So the hot thought is the thought that's most connected up with the emotions that you have, um so we can focus on that one.`,
        false,
        "bot"
      );

      df_text_query(
        `Do you know which one of those is kind of the most hot thought, one that's most kind of distressing for you?`,
        false,
        "bot"
      );
      setFocusThoughtDiaryLetter("b_c");
      setGetUTSBool(false);
      df_event_query("ABC_THOUGHT_DIARY_GET_HOT_THOUGHT");
    }
    console.log(getUTSContainer, "UTS CONTAINER");
  }
  function _handleUTSClick(title) {
    if (getUTSBool) {
      // df_text_query(title, false, "user");
      _handleTranslate(`${title}`, `${title}`, true);

      _handleTranslate(
        `Which one of these do you think might be it because I think you're probably right.`,
        `Alin sa mga ito ang napili mo? dahil sa tingin ko marahil ay tama ka.`
      );
      // df_text_query(
      //   `Which one of these do you think might be it because I think you're probably right.`,
      //   false,
      //   "bot"
      // );

      // console.log(getOtherThoughtB);
      // df_text_query(
      //   `Which one do you think might be a "${title}"`,
      //   false,
      //   "bot"
      // );
      _handleTranslate(
        `Which one do you think might be a "${title}"`,
        `Alin sa tingin mo dito ang "${title}"?`
      );
      setGetUTS(title);
    }
    setGetUTSThoughtBool(true);
    df_event_query("ABC_THOUGHT_DIARY_SELECT_UTS_THOUGHT");
  }
  // function _handleMoods(moodContainer) {
  //   let res = "";
  //   for (let i = 0; i < moodContainer.length; i++) {
  //     if (i === moodContainer.length - 1) {
  //       if (moodContainer[i].select === true) {
  //         res += moodContainer[i].mood_text + ".";
  //       }
  //     } else {
  //       if (moodContainer[i].select === true) {
  //         res += moodContainer[i].mood_text + ",";
  //       }
  //     }
  //   }
  //   return res;
  // }

  function renderMessages(returnedMessages) {
    // if (cookies.get("termsAndConditions")) {
    if (returnedMessages) {
      // console.log(returnedMessages);

      return returnedMessages.map((message, i) => {
        // console.log(i);
        return renderOneMessage(message, i);
      });
    } else {
      return null;
    }
    // }
  }

  useEffect(() => {
    if (!location.loaded) {
      // cookies.set("locationCookie", false, { path: "/" });
      setGetLocation(false);
    }
    if (
      showChatBox &&
      showBot &&
      cookies.get("termsAndConditions") &&
      getLocation
      // cookies.get("locationCookie")
    ) {
      talkInput.focus();
    }
    messagesEnd.scrollIntoView({ behavior: "smooth" });
    // console.log(talkInput);
    if (talkInput.current != null) {
      talkInput.focus();
    }
  });
  // }, [getLocation, cookies.get("termsAndConditions")]);

  function resolveAfterXSeconds(x) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(x);
      }, x * 1000);
    });
  }

  // jsx
  return (
    <div>
      <ToastContainer />
      <div className="z-40">
        {showBot ? (
          <div className="flex flex-col  md:w-96 xl:w-[500px] shadow-lg w-full border-2    bg-white right-0 bottom-[120px]  md:right-5  rounded-[20px] fixed  h-full md:h-3/4 ">
            {/* nav */}
            <nav className="border-b-[3px] border-[#E4E4E4]">
              <div className="p-4 flex flex-row justify-between ">
                <div className="flex  text-[#5DCFFF] text-[20px]  font-normal">
                  <span className="mr-2 self-center h-2 w-2 shadow-lg   rounded-full  bg-green-400 "></span>
                  <p>Ulayaw</p>
                </div>
                <ul className="right-0 cursor-pointer text-white font-semibold rounded-md bg-[#5DCFFF] h-[28px] w-[200px] flex justify-center transform hover:scale-[1.050] hover:opacity-80">
                  <li className=" ">
                    <p
                      // href="/"
                      // onClick={() => {
                      //   setShowBot(!showBot);
                      // }}
                      className=" text-[17px] select-none"
                      onClick={() => setSwitchLanguage(!switchLanguage)}
                    >
                      {switchLanguage
                        ? "Translate to English"
                        : "Translate to Filipino"}
                    </p>
                  </li>
                </ul>
                <ul className="right-0 cursor-pointer text-white font-semibold rounded-full bg-[#5DCFFF] h-[28px] w-[28px] flex justify-center transform hover:scale-[1.050]">
                  <li className=" ">
                    <a
                      href="/"
                      // onClick={() => {
                      //   setShowBot(!showBot);
                      // }}
                      className=" text-[19px] "
                      onClick={hide}
                    >
                      ✖
                    </a>
                  </li>
                </ul>
              </div>
            </nav>
            {/* body */}
            <div
              className="h-full  overflow-auto space-y-2 "
              //
            >
              <div className=" p-2 ">
                <div className=" rounded-lg  mb-2 text-sm ">
                  <div>
                    <div
                      className={
                        "flex justify-start space-x-2  p-2 rounded-lg bottom-0 "
                      }
                    >
                      <div className={"flex justify-end flex-col"}>
                        <div className=" rounded-full flex justify-center  text-white h-10 w-10  ">
                          <img src={ulayawFace} />
                          {/* <a href="/">{speaks}</a> */}
                        </div>
                      </div>

                      <div
                        className={
                          "rounded-[10px] self-center overflow-ellipsis  px-4 py-2 bg-[#F2EFEF] text-black font-medium text-left"
                        }
                      >
                        <label>
                          Kaibigan, ang pakikipag-usap na ito ay pribado. Ang
                          iyong pagkakakilanlan ay protektado at may siguridad
                          ang bawat impormasyon mababanggit. Maaaring basahin
                          muna ang
                          <button
                            className="pl-1 underline font-bold text-[#5DCFFF] cursor-pointer transform hover:scale-105"
                            onClick={() => {
                              setShowModal(true);
                            }}
                          >
                            kondisyon
                          </button>{" "}
                          upang makapag patuloy.
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {renderMessages(messages)}
              </div>
              <div
                ref={(el) => {
                  messagesEnd = el;
                }}
                className="clear-both"
                // style={{ float: "left", clear: "both" }}
              ></div>
            </div>
            {/* input */}
            {showChatBox && cookies.get("termsAndConditions") && getLocation ? (
              <label className="  border-[#E4E4E4]  w-full md:w-96  xl:w-[500px] flex flex-row border-t-2 rounded-b-[20px] ">
                <input
                  className=" focus:ring-1 focus:ring-[#5DCFFF] p-4 outline-none w-full rounded-b-[20px]"
                  type="text"
                  onKeyPress={_handleInputKeyPress}
                  placeholder="Iyong Mensahe ..."
                  ref={(input) => {
                    talkInput = input;
                  }}
                  disabled={!cookies.get("termsAndConditions")}
                />
                <button
                  className="absolute p-4 transform hover:scale-[1.1] right-0"
                  disabled={!cookies.get("termsAndConditions")}
                >
                  👉
                </button>
              </label>
            ) : (
              ""
            )}
          </div>
        ) : (
          <button>
            <button
              className=" h-[50px]  bottom-10  right-10  fixed  "
              // style={{ height: 500 }}
            >
              <nav>
                {/* border-[2px] border-[#5DCFFF] */}
                <div className=" flex flex-row justify-between rounded-full cursor-pointer shadow-lg ">
                  <span
                    className=" rounded-full flex justify-center text-white h-16   shadow-lg bg-[#5DCFFF]  p-1 transform hover:scale-[1.02] "
                    onClick={show}
                  >
                    <img src={ulayawFace} />
                    <span className=" h-2 w-2 shadow-lg animate-pulse  rounded-full absolute right-0 top-1 bg-green-400 "></span>

                    <span className=" absolute w-[125px] px-2 border-2 py-2 shadow-lg   rounded-lg text-center right-[70px] top-2 bg-white text-black border-[#5DCFFF]">
                      <p>kamusta! 👋</p>
                    </span>

                    {/* <a href="/">{speaks}</a> */}
                  </span>

                  {/* <a href="/" className="brand-logo">
                  Ulayaw - Chatbot
                </a> */}
                  {/* <ul className="right-0">
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
                </ul> */}
                </div>
              </nav>
              <div
                ref={(el) => {
                  messagesEnd = el;
                }}
                className="clear-both"
                // style={{ float: "left", clear: "both" }}
              ></div>
            </button>
          </button>
        )}
        {/* <DisplayBot talkInput={talkInput} messagesEnd={messagesEnd} /> */}
        {showModal ? (
          <ModalTermsAndConditions
            showModal={showModal}
            setShowModal={setShowModal}
          />
        ) : (
          ""
        )}
        {showModalLogin ? (
          <ModalLogin
            showModal={showModalLogin}
            setShowModal={setShowModalLogin}
            setQuickRepliesWelcome={setQuickRepliesWelcome}
            location={location.coordinates}
            setUserLoggedIn={setUserLoggedIn}
            df_event_query={df_event_query}
            df_text_query={df_text_query}
            _handleTranslate={_handleTranslate}
            assessment_meron_companion={assessment_meron_companion}
            setassessment_meron_companion={setassessment_meron_companion}
            // history={props.history}
          />
        ) : (
          ""
        )}

        {/* <DisplayBot talkInput={talkInput} messagesEnd={messagesEnd} /> */}
      </div>
      <div className="z-0 ">{showThoughtDiaryTool ? <ThoughtDiary /> : ""}</div>
      {showUTS ? (
        <UTS
          _handleUTSClick={_handleUTSClick}
          getUTSBool={getUTSBool}
          switchLanguage={switchLanguage}
        />
      ) : (
        ""
      )}
    </div>
  );
}

function ModalTermsAndConditionsCopy({ showModal, setShowModal }) {
  return (
    <div className="fixed top-0 w-full h-full bg-black bg-opacity-[0.75] ">
      <div className="h-full flex flex-col  justify-center align-center">
        {/* header */}
        <div className="w-3/4 rounded-t-[10px] text-[20px] lg:text-[26px] p-[18px] lg:p-[28px]  text-white self-center bg-[#5DCFFF] font-semibold">
          <p>Terms and Condition</p>
        </div>

        {/* body */}
        <div className="w-3/4 rounded-b-[10px] text-[12px] lg:text-[16px] p-[18px] px-[71px] py-[55px] self-center bg-white grid ">
          <p className="text-justify">
            RA 10173 or the Data Privacy Act protects individuals from
            unauthorized processing of personal information. The researchers
            will adhere to this law in order to protect the data privacy and
            confidentiality of all the respondents. Any identifiable information
            obtained in connection with this study will remain confidential,
            except if necessary, to protect your rights or welfare. <br />{" "}
            <br />
            This certificate means that the researcher can resist the release of
            information about your participation to people who are not connected
            with the study. When the research results are published or discussed
            in conferences, no identifiable information will be used. In
            addition, since the data gathering process will be conducted online,
            the researchers will highly secure the data obtained in a password
            protected computer after immediate retrieval from Conversation
            (DialogFlow & Ulayaw). <br />
            <br /> We would like to get your location as well for research
            purposes. The access of data will be restricted to the researchers
            only.
          </p>

          {/* agree */}
          <form className="mt-[20px] ">
            <label
              className={
                cookies.get("termsAndConditions")
                  ? " space-x-[10px]  text-gray-600 inline-block p-4 bg-gray-50 rounded-lg  select-none w-full"
                  : " space-x-[10px]  text-[#5DCFFF] inline-block p-4 hover:bg-gray-200 rounded-lg cursor-pointer select-none w-full"
              }
            >
              <input
                className="self-center"
                name="agreed"
                type="checkbox"
                onClick={() => {
                  cookies.set("termsAndConditions", true, { path: "/" });
                }}
                disabled={cookies.get("termsAndConditions")}
                checked={cookies.get("termsAndConditions")}

                // onChange={}
              />
              <p className="font-bold cursor-pointer inline-block">
                I Agree to the Terms and Agreement
              </p>
            </label>
          </form>
          {/* footer */}
          <button
            className="mt-[20px] text-white  px-[13px] py-[8px] justify-self-end lg:w-[70px] w-[60px] rounded-[5px] bg-[#5DCFFF]"
            onClick={() => {
              setShowModal(!showModal);
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function ThoughtDiaryCopy() {
  const { getAdverseStep3, setGetAdverseStep3 } = useContext(
    GetAdverseAnswerContext
  );
  const { getHotEmotionCAnswer, setGetHotEmotionCAnswer } = useContext(
    GetHotEmotionCAnswerContext
  );
  const { getOtherEmotionCAnswer, setGetOtherEmotionCAnswer } = useContext(
    GetOtherEmotionCAnswerContext
  );
  const { focusThoughtDiaryLetter, setFocusThoughtDiaryLetter } = useContext(
    ThoughtDiaryFocusContext
  );

  const { getOtherEmotionAll, setGetOtherEmotionAll } = useContext(
    GetOtherEmotionAllContext
  );
  const { getHotEmotionRate, setGetHotEmotionRate } = useContext(
    HotEmotionRateContext
  );
  const { getOtherThoughtB, setGetOtherThoughtB } = useContext(
    GetOtherThoughtBContext
  );
  const { getHotThoughtRate, setGetHotThoughtRate } = useContext(
    HotThoughtRateContext
  );

  const { getHotThoughtB, setGetHotThoughtB } = useContext(
    GetHotThoughtBContext
  );
  const { getUTSContainer, setGetUTSCointainer } = useContext(
    GetUTSContainerContext
  );
  const { getForEvidenceD, setGetForEvidenceD } = useContext(
    GetForEvidenceDContext
  );
  const { getAgainstEvidenceD, setGetAgainstEvidenceD } = useContext(
    GetAgainstEvidenceDContext
  );
  const { getLocation, setGetLocation } = useContext(GetLocationContext);

  let firstHit = -1;
  let firstHitOther = -1;

  function _handleMoodResultGetHotEmotionCAnswer(item, i) {
    // console.log(item, i, getHotEmotionCAnswer.length - 1, "test");

    if (item.select) {
      return item.mood_text;
    }
  }
  const [basket, setBasket] = useState([]);
  const [isHovering, setIsHovering] = useState(false);
  const [thought, setThought] = useState("");
  const HoverText = () => {
    return (
      <div className={"absolute  h-[100px]  w-[150px] -mt-[100px]  ml-[60px] "}>
        <div className="h-full flex flex-col w-full pl-[24px]">
          {/* header */}
          <div className="w-full rounded-[10px] text-[20px]  p-[10px]  text-white text-center self-center bg-[#5DCFFF] font-semibold shadow-lg border-2">
            <p>{thought}</p>
          </div>
          {/* body */}

          {/* {UTSList()} */}
        </div>
      </div>
    );
  };
  const onMouseEnter = () => {
    setIsHovering(true);
  };

  const onMouseLeave = () => {
    setIsHovering(false);
  };
  const [{ isOver }, dropRef] = useDrop({
    accept: "uts",
    drop: (item) =>
      setBasket((basket) =>
        !basket.includes(item) ? [...basket, item] : basket
      ),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });
  function _handleMoodResultGetOtherEmotionAll(item, i) {
    // console.log(item, i, getHotEmotionCAnswer.length - 1, "test");

    // item.select
    if (item) {
      return item;
    }
  }
  function _handleShowList(listContainer) {
    return listContainer.map((item, i) => {
      let res = "";
      if (listContainer.length === 1) return (res = item);

      if (i != 0) {
        res += ",";
      }
      res += item;
      return res;
    });
  }
  return (
    <div className="h-screen bg-[#3D829F]">
      <div className="left-0 top-0  w-[full] h-full  bg-opacity-[0.60] z-20 mb-6">
        <div className=" left-0   w-[1350px] pl-[24px] pt-[26px] h-full  ">
          {/* header */}
          <div className=" w-[215px] h-[54px] rounded-t-[15px] ml-2 text-[20px] lg:text-[24px] p-[18px] lg:pt-[11px] px-[23px] text-white self-center bg-[#49c3f7] font-bold">
            <p>Thought Diary</p>
          </div>

          {/* body */}
          {/* bg-black bg-opacity-[0.75] text-opacity-0  */}
          <div
            className={
              focusThoughtDiaryLetter != null
                ? "bg-[#5DCFFF] w-full rounded-[15px]  self-center grid grid-cols-4  min-h-[750px]  text-white font-semibold  "
                : "w-full rounded-[15px]  self-center grid grid-cols-4  min-h-[750px] text-[#4CC2F4] text-[20px] font-semibold bg-white "
            }
          >
            {/* A and C */}
            <div className="grid grid-rows-6 max-h-[750px]">
              {/* section 1 */}
              <div
                className={
                  focusThoughtDiaryLetter === "a" ||
                  focusThoughtDiaryLetter === "a_b"
                    ? "border-b-4 border-[#86A1AC] bg-white text-[#4CC2F4] row-span-2"
                    : "border-b-4 border-[#86A1AC] row-span-2"
                }
              >
                <div className=" p-4 break-words ">
                  <label className="text-[20px] ">A) Activating Event</label>
                  <div className="flex flex-col leading-none  text-[32px] text-center ">
                    <label className="text-[14px] font-normal text-justify text-blue-900 w-full  py-2 px-2 space-y-2">
                      (What happened? What did I do? What did others do? What
                      idea occurred to me? What’s stressing me out?)
                    </label>
                    <label className="text-[14px] text-blue-900  font-bold w-full">
                      This may be either: an actual event or situation, a
                      thought, mental picture or recollection.
                    </label>

                    <label
                      className="max-w-[300px] max-h-[250px]
                    text-[14px]"
                    >
                      {/* Crying out loud last week */}
                      {getAdverseStep3}
                    </label>
                  </div>
                </div>
              </div>
              {/* section 2 */}
              <div
                className={
                  focusThoughtDiaryLetter === "c" ||
                  focusThoughtDiaryLetter === "b_c"
                    ? " bg-white p-4 text-[#4CC2F4] row-span-4"
                    : " p-4 row-span-4"
                }
              >
                <label className="text-[20px] ">C) Consequences</label>
                <div className=" text-center break-words max-w-[300px]">
                  {/* Hot emotion section */}
                  <label className="flex flex-col leading-none">
                    <label>
                      <ol className="text-[14px] text-justify text-blue-900 font-normal  py-2 px-2 space-y-2">
                        <li>1. Write down words describing how you feel.</li>
                        <li>
                          2. Underline the one that is most associated with the
                          activating event.
                        </li>
                        <li>
                          3. Rate the intensity of that feeling (0 to 100).
                        </li>
                      </ol>
                      <label className="text-[14px] text-blue-900  font-bold">
                        hot emotion: rated {getHotEmotionRate}/10
                      </label>
                    </label>
                    {/* <label className="text-[14px] text-blue-900  font-bold">
                    hot emotion: rated {getHotEmotionRate}/10
                  </label> */}
                    <label className="">
                      {getHotEmotionCAnswer != null ||
                      (getHotEmotionCAnswer != undefined &&
                        getAdverseStep3 != null) ||
                      getAdverseStep3 != undefined
                        ? getHotEmotionCAnswer.map((item, i) => {
                            // console.log(firstHit === -1, firstHit);
                            if (item.select && firstHit === -1) {
                              firstHit = i;
                            }
                            return (
                              <>
                                {item.select && i != firstHit ? (
                                  <span className="text-[50px] leading-[0px]">
                                    ,
                                  </span>
                                ) : (
                                  ""
                                )}
                                {_handleMoodResultGetHotEmotionCAnswer(item, i)}
                              </>
                            );
                          })
                        : ""}
                      <span className="text-[50px] leading-[0px]">.</span>
                      {/* {count === 1 ? (
                      <span className="text-[50px] leading-[0px]">.</span>
                    ) : (
                      ""
                    )} */}

                      {/* Sad<span className="text-[50px] leading-[0px]">,</span> Low
                    feeling<span className="text-[50px] leading-[0px]">.</span> */}
                    </label>
                  </label>

                  {/* Other emotions section */}
                  <label className="pt-10 flex flex-col leading-none">
                    <label>
                      <ol className="text-[14px] text-justify text-blue-900 font-normal  py-2 px-2 space-y-2">
                        <li>
                          4. Jot down any physical sensations you experienced or
                          actions carried out.
                        </li>
                      </ol>
                      <label className="text-[14px] text-blue-900  font-bold">
                        other emotions you feel
                      </label>
                    </label>

                    <label className="">
                      {getOtherEmotionAll != null ||
                      getOtherEmotionAll != undefined
                        ? getOtherEmotionAll.map((item, i) => {
                            // console.log(firstHit === -1, firstHit);
                            // if (item.select && firstHitOther === -1) {
                            //   firstHitOther = i;
                            // }
                            return (
                              <>
                                {/* .select && i != firstHitOther */}
                                {i != 0 ? (
                                  <span className="text-[50px] leading-[0px]">
                                    ,
                                  </span>
                                ) : (
                                  ""
                                )}
                                {_handleMoodResultGetOtherEmotionAll(item, i)}
                              </>
                            );
                          })
                        : ""}
                      <span className="text-[50px] leading-[0px]">.</span>
                      {/* Heavy<span className="text-[50px] leading-[0px]">,</span>{" "}
                    Low Energy
                    <span className="text-[50px] leading-[0px]">,</span> Tired
                    <span className="text-[50px] leading-[0px]">.</span> */}
                    </label>
                  </label>
                </div>
              </div>
            </div>
            {/* B */}
            <div className="border-l-4 border-[#86A1AC] grid grid-rows-6 ">
              {/* section 1 */}
              <div
                className={
                  focusThoughtDiaryLetter === "b" ||
                  focusThoughtDiaryLetter === "b_c" ||
                  focusThoughtDiaryLetter === "a_b"
                    ? "pb-4 bg-white p-4 text-[#4CC2F4] row-span-4 border-b-4 border-[#86A1AC] max-h-[750px]"
                    : "pb-4 p-4 row-span-4 border-b-4 border-[#86A1AC] max-h-[750px]"
                }
              >
                <label className="text-[20px] ">B) Beliefs</label>
                <div className="text-center break-words max-w-[290px]">
                  {/* hot thought */}
                  <label className="flex flex-col leading-none">
                    <label>
                      <ol className="text-[14px] text-justify text-blue-900 font-normal py-2 px-2 space-y-2">
                        <li>
                          1. List all statements that link A to C. Ask yourself
                          "What was I thinking?" "What was I saying to myself?"
                          "What was going through my head at the time?".
                        </li>
                        <li>
                          2. Find the most distressing (hot) thought and
                          underline it.
                        </li>
                        <li>
                          3. Rate how much you believe this thought between (0
                          to 100).
                        </li>
                      </ol>
                      <label className="text-[14px] text-blue-900  font-bold">
                        the hot thought: rated {getHotThoughtRate}/100
                      </label>
                    </label>

                    <label className="">
                      {getHotThoughtB[0]}
                      {/* I'm always going to feel depressed
                    <span className="text-[50px] leading-[0px]">.</span> */}
                    </label>
                  </label>

                  {/* other thoughts */}
                  <label className="flex flex-col leading-none pt-10">
                    <label className="text-[14px] text-blue-900  font-bold">
                      other thoughts
                    </label>
                    {/* other thoughts instances */}
                    <div className="leading-normal flex flex-col w-full">
                      <label className="">
                        {/* {_handleShowList(getOtherThoughtB)} */}
                        {getOtherThoughtB != null ||
                        getOtherThoughtB != undefined
                          ? getOtherThoughtB.map((item, i) => {
                              // console.log(firstHit === -1, firstHit);
                              // if (item.select && firstHitOther === -1) {
                              //   firstHitOther = i;
                              // }
                              return (
                                <>
                                  {/* .select && i != firstHitOther */}
                                  {i != 0 ? (
                                    <span className="text-[50px] leading-[0px]">
                                      ,
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                  {item}
                                </>
                              );
                            })
                          : ""}
                        <span className="text-[50px] leading-[0px]">.</span>
                      </label>
                    </div>
                  </label>
                </div>
              </div>
              {/* section 2 */}
              <div
                className={
                  focusThoughtDiaryLetter === "b_uts"
                    ? " text-center break-words max-w-[330px]  pt-2 pb-4 px-4 bg-white p-4 text-[#4CC2F4] row-span-2"
                    : " text-center break-words max-w-[330px]  pt-2 pb-4 px-4 row-span-2"
                }
              >
                {/* The hot thought Unhelpful Thinking Styles */}
                <label className="flex flex-col leading-none">
                  <label className="text-[14px] text-blue-900  font-bold">
                    the hot thought unhelpful thinking style
                  </label>
                  <label className="max-h-[250px]">
                    {/* Jumping to Conclusions
                    <span className="text-[50px] leading-[0px]">.</span> */}
                    {getUTSContainer.length != 0 ? (
                      <>
                        {getHotThoughtB.length != 0 ? (
                          <>
                            {getUTSContainer.map((item, i) => {
                              if (getHotThoughtB[0] === item.thought) {
                                return (
                                  <>
                                    <span
                                      onMouseEnter={() => {
                                        setThought(item.thought);
                                        // console.log(item.thought, "sample");
                                        onMouseEnter();
                                        // <div>hello?</div>;
                                      }}
                                      onMouseLeave={() => {
                                        setThought("");

                                        onMouseLeave();
                                      }}
                                      className="cursor-pointer"
                                    >
                                      {item.title}
                                    </span>

                                    {/* <span className=" leading-[0px] px-2">
                                    {">"}
                                  </span>
                                  {item.thought} */}
                                  </>
                                );
                              }
                            })}
                            {/* {getHotThoughtB[0] === getUTSContainer[0].title ? (
                            <>
                              {getUTSContainer[0].title}
                              <span className=" leading-[0px] px-2">{">"}</span>
                              {getUTSContainer[0].thought}
                            </>
                          ) : (
                            ""
                          )} */}
                          </>
                        ) : (
                          ""
                        )}
                      </>
                    ) : (
                      ""
                    )}
                    {isHovering && HoverText()}
                    <span className="text-[50px] leading-[0px]">.</span>
                  </label>
                </label>

                {/* Other Unhelpful Thinking Styles  */}
                <label className="flex flex-col leading-none pt-10 max-w-[330px]">
                  <label className="text-[14px] text-blue-900  font-bold">
                    other mentioned unhelpful thinking styles
                  </label>
                  {/* other thoughts instances */}
                  <div className="leading-none flex flex-col">
                    <label className="max-h-[250px]">
                      {getUTSContainer.length != 0
                        ? getUTSContainer.map((item, i) => {
                            // console.log(getUTSContainer)
                            return (
                              <>
                                {getHotThoughtB[0] != item.thought ? (
                                  <>
                                    {item.title}
                                    <span className=" leading-[0px] px-2">
                                      {">"}
                                    </span>
                                    {item.thought}
                                    {i != getUTSContainer.length - 1 ? (
                                      <>
                                        <span className="text-[50px] leading-[0px]">
                                          ,
                                        </span>
                                      </>
                                    ) : (
                                      ""
                                    )}
                                  </>
                                ) : (
                                  ""
                                )}
                              </>
                            );
                          })
                        : ""}
                      <span className="text-[50px] leading-[0px]">.</span>
                    </label>
                  </div>
                </label>
              </div>
            </div>
            {/* D */}
            <div
              className={
                focusThoughtDiaryLetter === "d"
                  ? " bg-white border-l-4 text-[#4CC2F4] border-[#86A1AC] grid grid-rows-6 p-4"
                  : "border-l-4 border-[#86A1AC] grid grid-rows-6 p-4"
              }
            >
              {/* section 1 */}
              <div className="  break-words max-w-[330px] row-span-3 ">
                {/* Check the evidence */}
                <label className="text-[14px] text-blue-900  font-bold text-left">
                  1. Check the evidence
                </label>

                <div className="text-center flex flex-col justify-between h-full ">
                  {/* for evidence */}
                  <div className="h-[100px]">
                    <label className="flex flex-col leading-none ">
                      <label className="underline text-[14px]  text-blue-900 font-normal">
                        Factual evidence FOR my hot thought:
                      </label>

                      <div className="leading-none flex flex-col">
                        <label className="">
                          {/* {_handleShowList(getOtherThoughtB)} */}
                          {getForEvidenceD.length != 0
                            ? getForEvidenceD.map((item, i) => {
                                return (
                                  <>
                                    {/* .select && i != firstHitOther */}
                                    {i != 0 ? (
                                      <span className="text-[50px] leading-[0px]">
                                        ,
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                    {item}
                                  </>
                                );
                              })
                            : ""}
                          <span className="text-[50px] leading-[0px]">.</span>
                        </label>
                      </div>
                    </label>
                  </div>
                  {/* against evidence */}
                  <div className="h-[300px]">
                    <label className="flex flex-col leading-none ">
                      <label className="underline text-[14px]  text-blue-900 font-normal">
                        Factual evidence AGAINST my hot thought:
                      </label>

                      <div className="leading-none flex flex-col">
                        <label className="">
                          {/* {_handleShowList(getOtherThoughtB)} */}
                          {getAgainstEvidenceD.length != 0
                            ? getAgainstEvidenceD.map((item, i) => {
                                return (
                                  <>
                                    {/* .select && i != firstHitOther */}
                                    {i != 0 ? (
                                      <span className="text-[50px] leading-[0px]">
                                        ,
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                    {item}
                                  </>
                                );
                              })
                            : ""}
                          <span className="text-[50px] leading-[0px]">.</span>
                        </label>
                      </div>
                    </label>
                  </div>
                  <div className="h-[0px]"></div>
                </div>
              </div>

              {/* section 2 */}
              <div className="text-left row-span-1">
                {/* Challenge unhelpful thinking styles */}
                <label className="text-[14px] text-blue-900  font-bold">
                  2. Challenge unhelpful thinking styles
                </label>
                <label className="flex flex-col leading-none">
                  <label className="text-[14px] text-justify text-blue-900 font-normal italic pl-4">
                    Answer the disputation questions that apply to the unhelpful
                    thinking styles you've picked
                  </label>

                  <div className="leading-none flex flex-col"></div>
                </label>
              </div>
              {/* section 3 */}
              <div className=" text-center break-words max-w-[330px] row-span-2">
                {/* Change my perspective */}
                <div className="text-left">
                  <label className="text-[14px] text-blue-900  font-bold">
                    3. Change my perspective
                  </label>

                  <label className="flex flex-col leading-none">
                    <label className="text-[14px] text-justify text-blue-900 font-normal italic pl-4">
                      What are other ways of viewing the situation? What would
                      you say to someone you care about? To change how you act,
                      how would you need to think differently?
                    </label>

                    <div className="leading-none flex flex-col"></div>
                  </label>
                </div>
                <div></div>
              </div>
            </div>
            <div className="border-l-4 border-[#86A1AC] p-4">
              <label className="text-[20px] text-[#4CC2F4]">
                E) End Result
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default withRouter(ChatbotCopy);
