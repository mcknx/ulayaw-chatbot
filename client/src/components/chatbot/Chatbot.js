import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios/index";
import Message from "./Message";
import Card from "./Card";
import { authenticate, isAuth } from "../../helpers/auth";
import Cookies from "universal-cookie";
import { ToastContainer, toast } from "react-toastify";
import { v4 as uuid } from "uuid";
import QuickReplies from "./QuickReplies";
import MultipleChoice from "./MultipleChoice";
import GetMoods from "./GetMoods/GetMoods";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
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
import { GetInterpretationsContext } from "../../Context/GetInterpretationsContext";
import useGeoLocation from "../../hooks/useGeolocation";
import { GetLocationContext } from "../../Context/GetLocationContext";
import { ContinueThoughtDiaryContext } from "../../Context/ContinueThoughtDiaryContext";
import { PresentEmotion } from "../../Context/PresentEmotion";
import { ShowClientRoute } from "../../Context/ShowClientRoute";
import MapContainer from "./MapContainer";
import ModalLogin from "../ModalLogin";
import { useDrop } from "react-dnd";
import UTSCard from "./UTSCard";
import UTS from "../UTS";
import { Textfit } from "react-textfit";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import ulayawFace from "../../assets/ulayaw.png";
import ulayawA from "../../assets/ulayaw_gif/A.gif";
import ulayawB from "../../assets/ulayaw_gif/B.gif";
import ulayawC from "../../assets/ulayaw_gif/C.gif";
import ulayawExit from "../../assets/ulayaw_gif/exit.gif";
import ulayawWelcome from "../../assets/ulayaw_gif/welcome.gif";
import ulayawTD from "../../assets/ulayaw_gif/Thought-Diary.gif";
import PdfExtract from "./PdfExtract";
import Textarea from "rc-textarea";

const cookies = new Cookies();

function Chatbot(props) {
  const pdfExportComponent = useRef(null);
  const handleExportWithComponent = (event) => {
    pdfExportComponent.current.save();
  };
  const [restart, setRestart] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messagesFilipino, setMessagesFilipino] = useState([]);
  const [showBot, setShowBot] = useState(true);
  const [shopWelcomeSent, setShopWelcomeSent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalLogin, setShowModalLogin] = useState(false);
  const [assessment_meron_companion, setassessment_meron_companion] =
    useState(false);
  const [assessment_meron_companion_done, setassessment_meron_companion_done] =
    useState(true);
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
  const [activatingEvents, setActivatingEvents] = useState([]);
  const [getMoodWhenStartedStep1, setGetMoodWhenStartedStep1] = useState("");

  const { showPresentEmotion, setShowPresentEmotion } =
    useContext(PresentEmotion);

  // Step 2: Intro or Not Intro Thought Diary
  const { showThoughtDiaryTool, setShowThoughtDiaryTool } =
    useContext(ThoughtDiaryContext);
  // const [showThoughtDiaryTool, setShowThoughtDiaryTool] = useState(false);

  // Step 3: Get A) the Adverse part
  // const [activateGetAdverseStep3, setActivateGetAdverseStep3] = useState(0);
  const { getAdverseStep3, setGetAdverseStep3 } = useContext(
    GetAdverseAnswerContext
  );
  // const [getAdverseStep3UseState, setGetAdverseStep3UseState] = useState(null);

  // Step PDF: Save as PDF
  const [showPDF, setShowPDF] = useState(false);

  // Assessment User
  const [assessmentUser, setAssessmentUser] = useState();
  // Continue D, E, F
  const { continueThoughtDiary, setContinueThoughtDiary } = useContext(
    ContinueThoughtDiaryContext
  );

  // Step 4: Get C) the Consequences part
  const [getMoodOther, setGetMoodOther] = useState(false);
  const [getMoodHot, setGetMoodHot] = useState(false);
  const [getAfterFeelings, setGetAfterFeelings] = useState(false);
  const [getAfterFeelingsChat, setGetAfterFeelingsChat] = useState([]);
  const { getInterpretations, setGetInterpretations } = useContext(
    GetInterpretationsContext
  );

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
  const [getRateEmotionExplain, setGetRateEmotionExplain] = useState(false);
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
  const { showClientRoute, setShowClientRoute } = useContext(ShowClientRoute);

  const [value, setValue] = useState();

  let messagesEnd = useRef(null);
  let talkInput = useRef(null);

  if (cookies.get("userID") === undefined) {
    cookies.set("userID", uuid(), { path: "/" });
  }

  const onChange = (e) => {
    let foo = e.target.value;
    foo = foo.replace(/\r?\n|\r/g, "");
    // const {
    //   target: { value: currentValue },
    // } = e;
    setValue(foo);
  };

  const onResize = ({ width, height }) => {
    // console.log(e.target.value);
    console.log(`size is changed, width:${width} height:${height}`);
  };

  function _handleMoodResultGetHotEmotionCAnswer(item, i) {
    // console.log(item, i, getHotEmotionCAnswer.length - 1, "test");

    if (item.select) {
      return item.mood_text;
    }
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
            key: "AIzaSyAzfKhs0GtFbKBjEfn61zNJN2NsaFk5fKs",
          },
        },
      };

      // My Key
      // AIzaSyA6hz3_zGUdW-B6RrjX1zi2nKVfM9sRyjg

      // Free Key
      // AIzaSyAyesbQMyKVVbBgKVi2g6VX7mop2z96jBo
    } else if (extra === "welcome") {
      says = {
        // speaks: "user",
        speaks: speaker,
        msg: {
          welcome: {
            text: extra,
          },
        },
      };
    } else if (extra === "exit") {
      says = {
        // speaks: "user",
        speaks: speaker,
        msg: {
          exit: {
            text: extra,
          },
        },
      };
    } else if (extra === "diary") {
      says = {
        // speaks: "user",
        speaks: speaker,
        msg: {
          diary: {
            text: extra,
          },
        },
      };
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
            "bot",
            `Mangyaring payagan ang paggamit ng lokasyon, pumunta at sundan ang site na ito. I-refresh ang page na ito pagkatapos ng Salamat!
            
            https://support.google.com/chrome/answer/142065?hl=en.`
          );
        }
      }
      if (location.coordinates) {
        if (maxInput === 0) {
          if (cookies.get("termsAndConditions")) {
            _handleTranslate(
              `Thank you for giving us permission to use your location. Please read the terms and conditions above.`,
              `Maraming salamat sa pagbibigay sa amin ng pahintulot upang gamitin ang iyong lokasyon. Basahin muna ang kondisyon sa itaas.`
            );
            // _handleTranslate(
            //   `Please read the terms and conditions above.`,
            //   ``
            // );
            df_text_query(``, ``, `user`, ``, `welcome`);
          } else {
            _handleTranslate(
              `Thank you for giving us permission to use your location. Please read the terms and conditions above.`,
              `Maraming salamat sa pagbibigay sa amin ng pahintulot upang gamitin ang iyong lokasyon. Basahin muna ang kondisyon sa itaas.`
            );
            // _handleTranslate(
            //   `Please read the terms and conditions above.`,
            //   `Basahin muna ang kondisyon sa itaas.`
            // );
            df_text_query(``, ``, `user`, ``, `welcome`);
          }

          setMaxInput(maxInput + 1);
        }

        // if (cookies.get("termsAndConditions")) {
        if (getLocation && cookies.get("termsAndConditions")) {
          setMaxInput(0);
          // console.log(isAuth());
          setUserLoggedIn(isAuth());
          if (cookies.get("clientLogged") || showClientRoute) {
            _handleTranslate(
              `We appreciate your signing in, ${
                isAuth().first_name
              }. We've verified that you're ${
                isAuth().age
              } years old and that you're a ${isAuth().gender}.`,
              `Hello ${
                isAuth().first_name
              }, nagpapasalamat kami sa iyong pag sign in. Napag alaman namin na ikaw ay ${
                isAuth().age
              } taong gulang at isang ${
                isAuth().gender === "male" ? "lalaki" : "babae"
              }.`
            );
            _handleTranslate(
              `The information will be included in your profile's documentation. You can be assured that your data will be kept confidential and secure while in our care.`,
              `Ang mga impormasyong ito ay magiging bahagi lamang Sa dokumentasyon para sa iyong propayl. Makasisigurado po kayo na ang mga ito ay mananatiling pribado at ligtas sa aming pangangalaga.`
            );

            _handleTranslate(
              `Do you want to start our conversation? 😳 or you have an Assessment Code from the PMHA?`,
              `Gusto mo na bang mag simula? 😳 o mayroon kang Assessment Code mula sa PMHA?.`
            );

            df_event_query("LOGIN_CONTINUE");
          } else {
            df_event_query("Welcome");
            _handleTranslate(
              `How are you! I am Ulayaw. I am here to help and respond about your mental health. Do you want to login first?`,
              `Kumusta! Ako si Ulayaw, nandito ako upang tulungan at tugunan ang iyong kaisipang pangkalusugan. Gusto mo bang mag login muna?`
            );
          }
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

    // props.history.listen(() => {
    //   if (props.history.location.pathname === "/about" && !shopWelcomeSent) {
    //     df_event_query("WELCOME_SHOP");
    //     setShowBot(true);
    //     setShopWelcomeSent(true);
    //   }
    // });
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

  async function claim_code(input) {
    // const code = "123";
    // let chat = e.target.value;
    let email = isAuth().email;
    // console.log(email, "email");
    await axios
      .post(`/api/admin/claimCode`, {
        input,
        email,
      })
      .then((res) => {
        toast.success(res.data.message);
        setCorrectCode(true);
        console.log(res.data.user);
        setAssessmentUser(res.data.user);
        setShowChatBox(false);
        // toast.success(res.data.message);
      })
      .catch((err) => {
        setCorrectCode(false);
        setShowChatBox(true);
        // console.log(err.response);
        toast.error(err.response.data.errors);
      });
    // console.log(input);

    // if (input === code) {
    //   console.log("correct code");
    //   // df_text_query("I have a code");
    //   setCorrectCode(true);
    // } else {
    //   console.log("wrong code");
    //   // df_text_query("I have a code");
    //   setCorrectCode(false);
    // }
  }

  async function _handleInputKeyPress(e) {
    if (e.key === "Enter") {
      setValue(e.target.value);
      if (claimCode) {
        claim_code(e.target.value);
        // setShowChatBox(false)
      } else if (getMoodStep1) {
        if (e.target.value !== "") {
          setShowChatBox(false);
          toast.success("Please wait while the bot processes your message.");

          // user response
          let chat = e.target.value;
          _handleTranslate(e.target.value, e.target.value, true);
          setActivatingEvents((prevAct) => {
            return [...prevAct, chat];
          });

          // bot reponse

          let emotion;
          showPresentEmotion.map((item, i) => {
            if (item.select) {
              emotion = item.mood_text;
            }
          });
          await axios
            .get(`/api/useApi/understand/${e.target.value}/${emotion}`)
            .then((res) => {
              console.log(res);
              // setShowChatBox(false);
              // return res.data.data;
              // return res;
              _handleTranslate(
                `Topic: ${res.data.topic}`,
                `Topic: ${res.data.filTopic}`
              );
              _handleTranslate(
                `${res.data.second_person}`,
                `${res.data.filSecondPerson}`
              );
              // _handleTranslate(
              //   `${res.data.generate_essay}`,
              //   `${res.data.filEssay}`
              // );
              _handleTranslate(
                `${res.data.generate_answer}`,
                `${res.data.filAnswers}`
              );
            })
            .catch((err) => {
              // console.log(err.response);
              // setShowChatBox(false);
              // toast.error("Sorry there was an error");
              _handleTranslate(`Okay`, `Okay`);
            });
          // console.log(emotion, "test");
          // let engMsgUnderstood = await msgUnderstood.data.eng;
          // let filMsgUnderstood = await msgUnderstood.data.fil;

          // _handleTranslate(`${engMsgUnderstood}`, `${filMsgUnderstood}`);

          // bot response
          let assessStep1 = `Mayroon ka pa bang gusto sabihin?`;
          _handleTranslate(`Do you have anything else to say?`, assessStep1);
          df_event_query("ABC_STEP1_MOOD_ASSESS");
          setShowChatBox(false);
        }
      } else if (getMoodOther) {
        if (e.target.value !== "") {
          // user response
          _handleTranslate(e.target.value, e.target.value, true);
          let chat = e.target.value;
          // console.log(chat.split(/[ ,]+/));
          setGetOtherEmotionAll(chat.split(/[,]+/));
          _handleTranslate(
            `Choose one of those citations that is more relevant to "activating events" or events.`,
            `Pumili ng isa sa mga nabanggit na mas nauugnay sa "activating events" o kaganapan. `
          );
          // console.log(getOtherEmotionAll);
          df_event_query("ABC_THOUGHT_DIARY_EXPLAINING_C");
          setShowChatBox(false);
          setFocusThoughtDiaryLetter("a_c");
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
            if (chat <= 0 || chat > 100) {
              _handleTranslate(
                `Please put a number between (1-100)`,
                `Mangyaring maglagay ng numero sa pagitan ng (1-100)`
              );
            } else {
              setGetHotEmotionRate(chat);
              setGetRateEmotion(false);
              setGetRateEmotionExplain(true);
              _handleTranslate(`${chat}`, `${chat}`, true);
              _handleTranslate(
                `Can you explain why this is your rate?`,
                `Maaari mo bang maipaliwanag kung bakit ito ang iyong rate?`
              );

              // if (chat > 0 && chat < 51) {
              //   // df_text_query(chat, false);
              //   _handleTranslate(`${chat}`, `${chat}`, true);
              //   _handleTranslate(
              //     `Okay, that wasn't so strong. However, you mentioned experiencing these things that affected you. '${_handleMoods(
              //       getHotEmotionCAnswer
              //     )}' and '${_handleShowList(getOtherEmotionAll)}'`,
              //     `Okay, hindi siya ganoon tindi. Gayunpaman, binanggit mo ang karanasan sa mga bagay na ito na nakaapekto sa iyo. '${_handleMoods(
              //       getHotEmotionCAnswer
              //     )}' and '${_handleShowList(getOtherEmotionAll)}'`
              //   );
              // }
              // if (chat > 50 && chat <= 100) {
              //   _handleTranslate(`${chat}`, `${chat}`, true);
              //   _handleTranslate(
              //     `Okay, that's pretty strong. It's not surprising that you've noticed that these things affected you.`,
              //     `Okay, medyo matindi nga iyon. Hindi nakakagulat na napansin mo ang mga bagay na ito ay nakaapekto sa iyo.`
              //   );
              // }
            }
            console.log(chat);
          }
        } else {
          df_text_query("Please put anything in the chatbox", false, "bot");
        }
      } else if (getRateEmotionExplain) {
        let chat = e.target.value;

        if (e.target.value !== "") {
          _handleTranslate(e.target.value, e.target.value, true);
          setShowChatBox(false);
          setFocusThoughtDiaryLetter("b");
          // _handleTranslate(
          //   `Okay lets go human na boi, human ug alas 4 gagi hahahaha`,
          //   `Okay lets go human na boi, human ug alas 4 gagi hahahaha`
          // );
          setShowChatBox(false);
          toast.success("Please wait while the bot processes your message.");
          let emotion;
          showPresentEmotion.map((item, i) => {
            if (item.select) {
              emotion = item.mood_text;
            }
          });
          await axios
            .get(`/api/useApi/understand/${e.target.value}/${emotion}`)
            .then((res) => {
              console.log(res);
              // setShowChatBox(false);
              // return res.data.data;
              // return res;
              // _handleTranslate(
              //   `Topic: ${res.data.topic}`,
              //   `Topic: ${res.data.filTopic}`
              // );
              _handleTranslate(
                `${res.data.second_person}`,
                `${res.data.filSecondPerson}`
              );
              // _handleTranslate(
              //   `${res.data.generate_essay}`,
              //   `${res.data.filEssay}`
              // );
              _handleTranslate(
                `${res.data.generate_answer}`,
                `${res.data.filAnswers}`
              );
              _handleTranslate(
                `However, you mentioned experience with these things that affect you.`,
                `Gayunpaman, binanggit mo ang karanasan sa mga bagay na ito na nakakaapekto sa iyo.`
              );
              // df_event_query("ABC_THOUGHT_DIARY_B");
              // setGetRateEmotion(false);

              _handleTranslate(
                `Ask yourself. List all statements linking A (event) and C. (consequence). Share in detail what you want to say.`,
                `Tanungin ang iyong sarili. Ilista ang lahat ng pahayag na nag-uugnay sa A (kaganapan) at C. (kahihinatnan). Ibahagi ng detalyado ang nais mong sabihin. `
              );
              _handleTranslate(
                `What was your first thought or feeling at the event at that time?`,
                `Ano ba ang una mong naisip o na feel sa pangyayari noong panahong na iyon? `
              );
              setGetRateEmotionExplain(false);
              setFocusThoughtDiaryLetter("b_1");
              setGetOtherThoughtBool(true);
              setShowChatBox(true);
            })
            .catch((err) => {
              // console.log(err.response);
              // setShowChatBox(false);
              // toast.error("Sorry there was an error");
              _handleTranslate(`Okay`, `Okay`);
            });
        } else {
          df_text_query("Please put anything in the chatbox", false, "bot");
        }
      } else if (getOtherThoughtBool) {
        let chat = e.target.value;
        if (e.target.value !== "") {
          if (maxInput === 0) {
            setShowChatBox(true);
            _handleTranslate(`${chat}`, `${chat}`, true);
            _handleTranslate(
              `What first came to your mind at that time as you were feeling emotions based on your experience.`,
              `Ano ang unang pumasok sa isip mo noong panahon na iyon habang nakakaramdam ka ng emosyon base sa iyong experience?`
            );
            setFocusThoughtDiaryLetter("b_c");

            setMaxInput(1);
          }

          if (maxInput === 1) {
            setShowChatBox(true);
            _handleTranslate(`${chat}`, `${chat}`, true);
            _handleTranslate(
              `What did you say to yourself during those times?`,
              `Ano ang sinabi mo sa sarili mo noong mga panahon na iyon?`
            );
            setFocusThoughtDiaryLetter("b");

            setMaxInput(2);
          }
          if (maxInput === 2) {
            _handleTranslate(`${chat}`, `${chat}`, true);
            _handleTranslate(
              `Have you been struck by the relationship of your negative thoughts?`,
              `Napansin mo ba ang ugnayan ng iyong negatibong pagiisip?`
            );
            setFocusThoughtDiaryLetter("b_uts");
            // _handleTranslate(
            //   `Have you been struck by the relationship of your negative thoughts?`,
            //   `Kanina kinuha ko yung present mood (${showPresentEmotion[0].mood_text}) mo pagkatapos`
            // );
            df_event_query("ABC_THOUGHT_DIARY_B");
            setGetOtherThoughtBool(false);
            setShowChatBox(false);

            // df_event_query("ABC_THOUGHT_DIARY_B");
          }

          setGetOtherThoughtB((prevChats) => {
            return [...prevChats, chat];
          });
        } else {
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
      } else if (getAfterFeelings) {
        let chat = e.target.value;
        if (e.target.value !== "") {
          // user response
          _handleTranslate(e.target.value, e.target.value, true);
          setGetAfterFeelingsChat((prevAft) => {
            return [...prevAft, chat];
          });
          setGetInterpretations((prevAft) => {
            return [...prevAft, chat];
          });

          // bot reponse
          // let msgUnderstood = await _handleTranslateEng(e.target.value, true);
          // let engMsgUnderstood = await msgUnderstood.data.eng;
          // let filMsgUnderstood = await msgUnderstood.data.fil;

          // _handleTranslate(`${engMsgUnderstood}`, `${filMsgUnderstood}`);
          // _handleTranslate(`Okay`, `Okay`);
          setShowChatBox(false);
          toast.success("Please wait while the bot processes your message.");
          let emotion;
          showPresentEmotion.map((item, i) => {
            if (item.select) {
              emotion = item.mood_text;
            }
          });
          await axios
            .get(`/api/useApi/understand/${e.target.value}/${emotion}`)
            .then((res) => {
              console.log(res);
              // setShowChatBox(false);
              // return res.data.data;
              // return res;
              // _handleTranslate(
              //   `Topic: ${res.data.topic}`,
              //   `Topic: ${res.data.filTopic}`
              // );
              _handleTranslate(
                `${res.data.second_person}`,
                `${res.data.filSecondPerson}`
              );
              // _handleTranslate(
              //   `${res.data.generate_essay}`,
              //   `${res.data.filEssay}`
              // );
              _handleTranslate(
                `${res.data.generate_answer}`,
                `${res.data.filAnswers}`
              );
              // _handleTranslate(
              //   `However, you mentioned experience with these things that affect you.`,
              //   `Gayunpaman, binanggit mo ang karanasan sa mga bagay na ito na nakakaapekto sa iyo.`
              // );
              // bot response
              let assessStep1 = `Mayroon ka pa bang gusto sabihin? `;
              _handleTranslate(
                `Do you have anything else to say? `,
                assessStep1
              );
              df_event_query("ABC_THOUGHT_DIARY_B_AFTER");
              setShowChatBox(false);
            })
            .catch((err) => {
              // console.log(err.response);
              // setShowChatBox(false);
              // toast.error("Sorry there was an error");
              _handleTranslate(`Okay`, `Okay`);
            });
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

      // e.target.value = "";
      // setValue(e.target.value.split(/[/n]+/));
      setValue("");
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
      setShowChatBox(false);
      return await axios
        .get(`/api/useApi/understand/${inputData}`)
        .then((res) => {
          console.log(res);
          setShowChatBox(false);
          // return res.data.data;
          return res;
        })
        .catch((err) => {
          console.log(err.response);
          setShowChatBox(false);
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

  async function _handleQuickReplyPayload(event, payload, text) {
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
      case "meron_pa_mood_assess":
        setShowChatBox(true);
        // _handleTranslate(`Oo, Meron pa`, `Oo, Meron pa`);
        break;
      case "wala_na_mood_assess":
        // setShowChatBox(false);
        let moodAssessRes = `Ang lahat ng iyong ibinahagi ay parte ng dahilan ng mga kaganapan o "Activating events".`;
        _handleTranslate(
          `Everything you share is part of the cause of the events or "Activating events".`,
          moodAssessRes
        );
        let selectActivatingEvent = `Pwede ka bang pumili ng isang kaganapan?
        'activating events' na nailahad mo?`;
        _handleTranslate(
          `Can you select one of the 'activating events' you have described?`,
          selectActivatingEvent
        );
        console.log(activatingEvents);

        setShowThoughtDiaryTool(true);
        setFocusThoughtDiaryLetter("a_1");
        df_event_query("ABC_THOUGHT_DIARY_SELECT_A");
        // console.log(activatingEvents);

        // _handleTranslate(`Wala na`, `Wala na`);
        break;
      // case "assessment_meron_companion":
      //   df_event_query("ASSESSMENT_DONE");
      //   setShowModalLogin(true);

      //   setassessment_meron_companion(true);
      //   _handleTranslate(
      //     `Nais kong panatilihing mo makiugnay kay ${assessmentUser.companion.companion_first_name}. Maaari mo siyang kausapin o bigyan ng indikasyon na-aayon sa iyong nararamdaman o naiisip.`,
      //     `Nais kong panatilihing mo makiugnay kay ${assessmentUser.companion.companion_first_name}. Maaari mo siyang kausapin o bigyan ng indikasyon na-aayon sa iyong nararamdaman o naiisip.`
      //   );

      //   _handleTranslate(
      //     `Salamat sa pagkakataong ibinigay mo upang mapag usapan ang iyong mga suliranin. Base sa ating mga napag usapan, mas makatutulong na ipagpatuloy ang pagproseso ng iyong concerns sa pamamagitan ng psychiatric consultation. Huwag ka sanang mahihiyang lumapit muli sa akin kapag kailangan mo ulit ng aming tulong. Palagi kang mag iingat!`,
      //     `Salamat sa pagkakataong ibinigay mo upang mapag usapan ang iyong mga suliranin. Base sa ating mga napag usapan, mas makatutulong na ipagpatuloy ang pagproseso ng iyong concerns sa pamamagitan ng psychiatric consultation. Huwag ka sanang mahihiyang lumapit muli sa akin kapag kailangan mo ulit ng aming tulong. Palagi kang mag iingat!`
      //   );

      //   _handleTranslate(
      //     `Nais mo na bang ipagpatuloy ang pakikipag usap natin? May ibabahagi sana akong tool sa iyo.`,
      //     `Nais mo na bang ipagpatuloy ang pakikipag usap natin? May ibabahagi sana akong tool sa iyo.`
      //   );

      //   _handleTranslate(
      //     `Ito ay ginagamit ko paminsan minsan upang ma bawasan ang bigat na aking nararamdaman. 🤗`,
      //     `Ito ay ginagamit ko paminsan minsan upang ma bawasan ang bigat na aking nararamdaman. 🤗`
      //   );
      //   // df_text_query(``, ``, `user`, ``, `diary`);
      //   df_text_query(
      //     `Change to your current location, a nearby police station, or a nearby hospital by clicking the red circle!`,
      //     false,
      //     `Lumipat sa iyong kasalukuyang lokasyon, isang malapit na istasyon ng pulisya, o isang malapit na ospital sa pamamagitan ng pag-click sa pulang bilog!`,
      //     "bot",
      //     "map"
      //   );
      //   break;
      // case "assessment_wala_companion":
      //   df_event_query("ASSESSMENT_DONE");
      //   _handleTranslate(
      //     `Salamat sa pagkakataong ibinigay mo upang mapag usapan ang iyong mga suliranin. Base sa ating mga napag usapan, mas makatutulong na ipagpatuloy ang pagproseso ng iyong concerns sa pamamagitan ng psychiatric consultation. Huwag ka sanang mahihiyang lumapit muli sa akin kapag kailangan mo ulit ng aming tulong. Palagi kang mag iingat!`,
      //     `Salamat sa pagkakataong ibinigay mo upang mapag usapan ang iyong mga suliranin. Base sa ating mga napag usapan, mas makatutulong na ipagpatuloy ang pagproseso ng iyong concerns sa pamamagitan ng psychiatric consultation. Huwag ka sanang mahihiyang lumapit muli sa akin kapag kailangan mo ulit ng aming tulong. Palagi kang mag iingat!`
      //   );

      //   _handleTranslate(
      //     `Nais mo na bang ipagpatuloy ang pakikipag usap natin? May ibabahagi sana akong tool sa iyo.`,
      //     `Nais mo na bang ipagpatuloy ang pakikipag usap natin? May ibabahagi sana akong tool sa iyo.`
      //   );

      //   _handleTranslate(
      //     `Ito ay ginagamit ko paminsan minsan upang ma bawasan ang bigat na aking nararamdaman. 🤗`,
      //     `Ito ay ginagamit ko paminsan minsan upang ma bawasan ang bigat na aking nararamdaman. 🤗`
      //   );
      //   df_text_query(
      //     `Change to your current location, a nearby police station, or a nearby hospital by clicking the red circle!`,
      //     false,
      //     `Lumipat sa iyong kasalukuyang lokasyon, isang malapit na istasyon ng pulisya, o isang malapit na ospital sa pamamagitan ng pag-click sa pulang bilog!`,
      //     "bot",
      //     "map"
      //   );
      //   break;
      case "training_masterclass":
        df_event_query("MASTERCLASS");
        break;
      case "training_demographics-continue":
        // setShowMoods(true);

        _handleTranslate(
          `Hi ${userLoggedIn.first_name}, I'm glad you are here today. Maybe we could start by getting your mood. First, I want you to pick the most likely feelings you are into right now.`,
          `Hi ${userLoggedIn.first_name}, natutuwa ako na narito ka ngayon. Siguro maaari nating simulan sa pagkuha ng iyong nararamdaman. Pumili ka ng isa dito sa ating 'emotion box' na pinakanararamdaman mo ngayon.`
        );

        df_event_query("ABC_GETMOOD");
        break;

      case "abc_continue_step_1":
        console.log(assessmentUser);
        if (restart) {
          window.location.reload();
        }
        _handleTranslate(
          `Hi ${userLoggedIn.first_name}, I'm glad you are here today. Maybe we could start by getting your mood. First, I want you to pick the most likely feelings you are into right now.`,
          `Hi ${userLoggedIn.first_name}, natutuwa ako na narito ka ngayon. Siguro maaari nating simulan sa pagkuha ng iyong nararamdaman. Pumili ka ng isa dito sa ating 'emotion box' na pinakanararamdaman mo ngayon.`
        );
        df_event_query("ABC_GETMOOD");
        break;
      // case "print_diary":
      //   _handleTranslate(`Okay, Thank you!`, `Okay, Thank you!`);
      //   showChatBox(false);
      //   break;
      case "no_print_diary":
        _handleTranslate(`Okay, Thank you!`, `Okay, Maraming Salamat!`);
        _handleTranslate(
          `Just come back when you have a problem`,
          `Mag balik ka lang pag may problema ka`
        );
        setShowChatBox(false);
        break;

      // case "abc_oo_b_intro_deep":
      //   setContinueThoughtDiary(true);
      //   break;
      // case "abc_hindi_b_intro_deep":
      //   _handleTranslate(
      //     `Thank you so much for confirming, I'm happy with the things you share! I am glad you have the courage to share your thoughts with me.`,
      //     `Maraming salamat sa pagkumpirma, masaya ako sa mga bagay na ibahagi mo! Masaya ako na mayroon kang katapangan na ibahagi ang iyong mga saloobin sa akin. `
      //   );
      //   _handleTranslate(
      //     `Do you want to save this thought diary as PDF?`,
      //     `Gusto mo bang e save itong thought diary as PDF?`
      //   );
      //   setShowChatBox(false);
      //   setShowPDF(true);
      //   df_event_query("ABC_THOUGHT_PRINT");
      //   break;
      // case "proceed_to_a":

      //   break;

      case "abc_oo_b":
        _handleTranslate(
          `What are they? Can you share interpretations or thoughts you have right now?`,
          `Ano-ano ang mga ito? Maari mo ba ibahagi ang mga interpretasyon o iyong naiisip sa ngayon?`
        );
        // df_event_query("ABC_THOUGHT_DIARY_B_AFTER");
        setGetAfterFeelings(true);
        setShowChatBox(true);
        break;
      case "abc_oo_b_after":
        _handleTranslate(
          `Share in detail what you want to say.`,
          `Ibahagi ng detalyado ang nais mong sabihin.`
        );
        // df_event_query("ABC_THOUGHT_DIARY_B_AFTER");
        setGetAfterFeelings(true);
        setShowChatBox(true);
        break;

      case "abc_hindi_b_after":
        _handleTranslate(
          `Thank you so much for confirming, I'm happy with the things you share! I am glad you have the courage to share your thoughts with me.`,
          `Maraming salamat sa pagkumpirma, masaya ako sa mga bagay na ibahagi mo! Masaya ako na mayroon kang katapangan na ibahagi ang iyong mga saloobin sa akin. `
        );
        _handleTranslate(
          `Do you want to save this thought diary as PDF?`,
          `Gusto mo bang e save itong thought diary as PDF?`
        );
        setShowChatBox(false);
        setShowPDF(true);
        df_event_query("ABC_THOUGHT_PRINT");
        break;
      // case "abc_hindi_b_after":
      //   _handleTranslate(
      //     `I want to let you know. I use this tool to try to find out why your mood has changed. Because I want you to try to understand how important your thoughts are to affecting your mood and perspective.`,
      //     `Nais kung ipaalam sayo kaibigan.Ginagamit ko ang tool na ito para subukang malaman kung bakit nagbago ang iyong mood. Dahil gusto kong subukan mong maunawaan kung gaano kahalaga ang iyong mga iniisip sa nakakaapekto sa iyong mood at pananaw.`
      //   );
      //   _handleTranslate(
      //     `Do you want to continue this conversation?`,
      //     `Nais mo ba ipagpatuloy ang paguusap naito?`
      //   );
      //   df_event_query("ABC_THOUGHT_DIARY_B_INTRO_TO_DEEP");
      //   setGetAfterFeelings(false);
      //   setShowChatBox(false);
      //   break;

      case "abc_hindi_b":
        _handleTranslate(
          `When a person experiences a negative feeling caused by an event or activating life events, it is usually followed by negative self-beliefs.`,
          `Kapag ang isang tao ay nakakaranas ng isang negatibong nararamdaman sanhi ng kaganapan o activating events sa buhay, ito ay karaniwang nasusundan ng mga negatibong paniniwala sa sarili.`
        );
        _handleTranslate(
          `Because of that, can you imagine what negative beliefs you hold?`,
          `Dahil diyan, maaari mo bang isipin kung anong negatibong paniniwala ang pinanghahawakan mo?`
        );
        _handleTranslate(
          `Unhelpful thinking styles are unhelpful statements and self-thinking, it may well be in one of the ones you mentioned earlier in the Beliefs section. If so, what irrational style of thinking have you gone through that you want to change?`,
          `Ang hindi makatwirang istilo ng pag-iisip ay ang mga hindi nakakatulong na mga pahayag at pag-iisip sa sarili, maaaring nasa isa na rin ito sa mga binanggit mo kanina sa Beliefs seksyon. Kung gayon, anong hindi makatwirang istilo ng pag-iisip napagdaanan mo na nais mong baguhin?`
        );
        _handleTranslate(
          `What are they? Can you share interpretations or thoughts you have right now?`,
          `Ano-ano ang mga ito? Maari mo ba ibahagi ang mga interpretasyon o iyong naiisip sa ngayon?`
        );
        // df_event_query("ABC_THOUGHT_DIARY_B_AFTER");
        setShowChatBox(true);
        setGetAfterFeelings(true);
        break;
      case "proceed_to_a_assess":
        break;
      // case "show_thought_diary":
      //   setGetMoodWhenStartedStep1(text.toLowerCase());
      //   _handleTranslate(
      //     `Okay, while I was viewing your responses, it occurred to me that this would be a good subject for us to go through in my thought diary tool.
      //     I'm using this tool to try to figure out why your mood has changed. Because I want you to understand how important your thoughts may be in affecting your mood.`,
      //     `Okay, habang tinitingnan ko ang iyong mga tugon, naisip ko na ito ay isang magandang paksa para pag-usapan natin sa aking tool sa talaarawan sa pag-iisip. Ginagamit ko ang tool na ito para subukang malaman kung bakit nagbago ang iyong mood. Dahil gusto kong subukan mong maunawaan kung gaano kahalaga ang iyong mga iniisip sa nakakaapekto sa iyong mood.`
      //   );
      //   _handleTranslate(
      //     `Okay, so I'd like you to follow along with the thought diary tool, and we've also got it shown here in the background so that we can put down things there as well.`,
      //     `Baka gusto mong tingnan ang tool na ito para mas maunawaan kung ano ang tungkol dito. Dahil bago ka rito, maaaring gusto mong tingnan ang sunud-sunod na gabay na ito kung paano gamitin ang tool na ito ngunit huwag mag-alala, ituturo ko sa iyo ito.`
      //   );

      //   return df_event_query("ABC_THOUGHT_DIARY_NOT_INTRO");
      case "yes_mood_different":
        // setShowMoods(true);
        break;
      case "abc_explaining_c_nothing":
        // df_event_query("ABC_THOUGHT_DIARY_C_RATE_EMOTION");
        // _handleTranslate(
        //   `Okay, so I understand that you've had to deal with a lot of the consequences. However, these are only a few of the ones I noted. '${_handleMoods(
        //     getHotEmotionCAnswer
        //   )}' and '${_handleShowList(getOtherEmotionAll)}'`,
        //   `Okay, naiintindihan ko na kinailangan mong harapin ang maraming masasamang bagay na ito. Gayunpaman, ilan lamang ito sa mga nabanggit mo. '${_handleMoods(
        //     getHotEmotionCAnswer
        //   )}' and '${_handleShowList(getOtherEmotionAll)}'`
        // );
        // if (getAfterFeelings) {
        //   _handleTranslate(
        //     `And you did this after experiencing those.'${getAfterFeelingsChat}'`,

        //     `At ginawa mo ito pagkatapos mong maranasan ang mga ito.'${getAfterFeelingsChat}'`
        //   );
        // }
        // _handleTranslate(
        //   `Okay, so that '${_handleMoods(
        //     getHotEmotionCAnswer
        //   )}' feeling, um. When you say you felt it ${getMoodWhenStartedStep1} give me an idea of how strong it was.`,
        //   `Okay, itong '${_handleMoods(
        //     getHotEmotionCAnswer
        //   )}' na feeling, um. Kapag sinabi mong naramdaman mo ito ${getMoodWhenStartedStep1} bigyan mo ako ng ideya kung gaano ito sama.'`
        // );
        // _handleTranslate(
        //   `If you had to give it a rating out of ten (1-10), how would you rate it?`,
        //   `Kung kailangan mong bigyan ito ng rating sa sampu (1-10), paano mo ito ire-rate?`
        // );

        // setGetRateEmotion(true);
        // setShowChatBox(false);
        // console.log("event");
        // setShowMoods(true);
        break;
      // case "abc_explaining_c_type":
      //   setShowChatBox(true);
      //   setGetAfterFeelings(true);
      //   // _handleTypeToChatbox("after_feelings");
      //   // setShowMoods(false);
      //   break;
      // case "explaining_b_get_thought_other_done":
      //   setMaxInput(0);
      //   setShowChatBox(false);
      //   // df_text_query(
      //   //   `Okay, um, before  we kind of leap into that, the idea of kind of challenging or getting curious about some of those thoughts.
      //   //   `,
      //   //   false,
      //   //   "bot"
      //   // );
      //   _handleTranslate(
      //     `Okay, um, before  we kind of leap into that, the idea of kind of challenging or getting curious about some of those thoughts.`,
      //     `Okay, ahhm, bago tayo pumunta doon, ang hamonin o pag-usisain patungkol sa isa sa mga kaisipang na ibahagi mo.`
      //   );
      //   _handleTranslate(
      //     `There's one more thing thing I wanted to do and that was to have a look and see if we could notice any of those 'unhelpful thinking styles'.`,
      //     `May bagay lang akong gustong gawin, at iyon ay tingnan kung mapapansin natin ang alin sa mga 'unhelpful thinking styles' na ito.`
      //   );
      //   // df_text_query(
      //   //   `There's one more thing thing I wanted to do and that was to have a look and see if we could notice any of those unhelpful thinking styles.
      //   //     `,
      //   //   false,
      //   //   "bot"
      //   // );
      //   _handleTranslate(
      //     `Now, I'm just going to show you this graphic interface about 'unhelpful thinking styles'.`,
      //     `Ngayon, ipapakita ko lang sa iyo ang graphic interface na ito patungkol sa 'unhelpful thinking styles'`
      //   );
      //   // df_text_query(
      //   //   `Now, I'm just going to show you this graphic interface about unhelpful thinking styles.
      //   //     `,
      //   //   false,
      //   //   "bot"
      //   // );

      //   _handleTranslate(
      //     `I want you to remember that these were the things that are really common when people are having problem and they start to think in these characteristic ways and some of them you'll notice happening for you a lot of the time and some not so much.`,
      //     `Nais kong tandaan mo na ito ang mga bagay na talagang karaniwan na iniisip, kapag ang mga tao ay nagkakaroon ng problema sila ay nagsisimulang mag-isip sa isa sa mga katangiang ito. At ang ilan sa mga ito ay mapapansin mong nangyayari sa iyo ng maraming beses at ang ilan ay hindi gaanong beses.`
      //   );
      //   // df_text_query(
      //   //   `I want you to remember that these were the things that are really common when people are having problem and they start to think in these characteristic ways and some of them you'll notice happening for you a lot of the time and some not so much.
      //   //     `,
      //   //   false,
      //   //   "bot"
      //   // );
      //   df_event_query("ABC_THOUGHT_DIARY_SHOW_UTS");
      //   setFocusThoughtDiaryLetter("b");
      //   // console.log(getOtherThoughtBool, "getOtherThoughtBool");
      //   // console.log(giveUTS, "giveUTS");
      //   // setMaxInput(0);
      //   // setGiveUTS(true);
      //   // _handleTypeToChatbox("after_feelings");
      //   // setShowMoods(false);
      //   break;
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

      case "exit_ulayaw":
        // _handleTranslate(`Exit`, `Exit`, true);
        _handleTranslate(
          `Okay thank you for using app!`,
          `Okay salamat sa pag gamit ng app!`
        );
        setShowChatBox(false);
        break;

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
    setAssessmentUser((prevAss) => {
      return { ...prevAss, result: res };
    });
    console.log("Ass Result", assessmentUser);
    console.log("Assessment Result:", res, "Assessment Total:", total);

    // df_event_query("ASSESSMENT_DONE");
    df_event_query("ASSESSMENT_COMPANION");
    setShowChatBox(false);
    _handleTranslate(
      `Meron ka bang kasama ngayon?`,
      `Meron ka bang kasama ngayon?`
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
    let inputData = `Base sa iyong napiling mood. Mayroon ka bang ideya kung kailan, saan at paano ito nagsimula? at gaano mo na katagal itong nararamdaman?`;

    _handleTranslate(
      _handleMoods(selectedMoods),
      _handleMoodsTag(selectedMoods),
      true
    );

    // let ms = await _handleTranslateEng(inputData, false);
    _handleTranslate(
      `Based on your chosen mood. Do you have any idea when, where and how it started? and how long have you been feeling it?`,
      inputData
    );

    // _handleTranslate(
    //   `Do you have any ideas when these mood(s) first appeared?`,
    //   `Okay, mayroon ka bang idea kung kailan nagsimula mong maramdaman ang mga mood na ito?`
    // );

    setGetMoodStep1(true);
    setShowChatBox(true);
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
  async function walaAkongCode(assessmentUser) {
    let assessmentTaker = assessmentUser;
    return await axios
      .post(`/api/admin/addCompanion`, {
        assessmentTaker,
        companion_first_name: "",
        companion_last_name: "",
        companion_contact_no: "",
      })
      .then((res) => {
        // toast.success(res.response.data);
        console.log(res);
        df_event_query("ASSESSMENT_DONE");
        setShowChatBox(false);
        setassessment_meron_companion(false);
        setassessment_meron_companion_done(false);
        setShowModal(false);
        _handleTranslate(
          `I don't have a companion`,
          `Wala akong ka kasama`,
          true
        );

        if (res.data.user.result === "low") {
          // Low
          _handleTranslate(
            `Thank you ${userLoggedIn.first_name} for allowing me to be of help. Whatever you disclose in our conversation will remain between the two of us. Do not hesitate to reach out again whenever you need mental health assistance. Stay safe and healthy!`,
            `Salamat sa pagkakataong ibinigay mo upang mapag usapan ang iyong mga suliranin. Makakaasa ka na mananatiling pribado at sa pagitan lamang nating dalawa ang mga napag-usapan natin ngayong araw na ito. Huwag ka sanang mahihiyang lumapit muli sa amin kapag kailangan mo ulit ng aming tulong. Palagi kang mag iingat ${userLoggedIn.first_name}!`
          );
        }
        if (res.data.user.result === "high") {
          // High
          _handleTranslate(
            `I am saddened to hear that you are going through such challenges ${userLoggedIn.first_name}. It must have been tough carrying all these and what a brave soul you are for recognizing your need for help. `,
            `Salamat sa tiwala at sa pagbabahagi ng mga pinagdaraanan mo. Nakalulungkot marining na ikaw ay dumaranas ng ganitong mga pagsubok ${userLoggedIn.first_name}. Gayun pa man ay humahanga ako sa katatagan na pinapakita mo sa gitna ng mga problemang iyong kinakaharap.`
          );
          _handleTranslate(
            `Thank you ${userLoggedIn.first_name} for allowing me to be of help. Based on our conversation, it would be better to continuously address your concerns through a psychiatric consultation. Here at PMHA, we are willing to provide the initial consultation subject to the availability of the mental health professional. Should you be advised to have follow-up consultations, you may refer to your staff in charge to further discuss the process, options, and other concerns.`,
            `Salamat ${userLoggedIn.first_name} sa pagkakataong ibinigay mo upang mapag usapan ang iyong mga suliranin. Base sa ating mga napag usapan, mas makatutulong na ipagpatuloy ang pagproseso ng iyong concerns sa pamamagitan ng psychiatric consultation. Ang PMHA ay handang maglaan ng paunang konsultasyon upang lalo ka pa namin matugunan bukod sa pag uusap natin ngayong araw. Kung sakaling kailanganin pa ng follow up consultation ay mangyaring sumangguni sa aming staff-in-charge  upang mapag usapan ang proseso, options at iba pang concerns.`
          );
        }

        _handleTranslate(
          `Nais mo na bang ipagpatuloy ang pakikipag usap natin? May ibabahagi sana akong tool sa iyo.`,
          `Nais mo na bang ipagpatuloy ang pakikipag usap natin? May ibabahagi sana akong tool sa iyo.`
        );

        _handleTranslate(
          `Ito ay ginagamit ko paminsan minsan upang ma bawasan ang bigat na aking nararamdaman. 🤗`,
          `Ito ay ginagamit ko paminsan minsan upang ma bawasan ang bigat na aking nararamdaman. 🤗`
        );
        df_text_query(
          `Change to your current location, a nearby police station, or a nearby hospital by clicking the red circle!`,
          false,
          `Lumipat sa iyong kasalukuyang lokasyon, isang malapit na istasyon ng pulisya, o isang malapit na ospital sa pamamagitan ng pag-click sa pulang bilog!`,
          "bot",
          "map"
        );
        // df_text_query(``, ``, `user`, ``, `diary`);
      })
      .catch((err) => {
        // setCorrectCode(false);
        // console.log(err.response);
        toast.error(err.response.data.errors);
      });
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
                  {switchLanguage ? (
                    <label className="text-center ">{`${userLoggedIn.first_name},  ito ang mga establisyimento at awtoridad na malapit sa iyong lokasyon. Maaari kang lumapit at makipag-ugnayan sa sandaling kailangan mo sila. Huwag mag-atubiling suriin at makipag-ugnayan. Salamat!
`}</label>
                  ) : (
                    <label className="text-center ">{`${userLoggedIn.first_name},  these are the establishment and authorities near at your location. You can approach and contact as soon as you needed them. Don't hesitate to check and keep in touch. Thank you!`}</label>
                  )}

                  <span className=" h-[350px] md:w-[350px] relative">
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
                  // space-x-2 py-2
                  className={
                    "rounded-[10px] self-center overflow-ellipsis  md:px-4    text-black font-medium text-left h-[150px] md:h-[300px] flex flex-col justify-center w-full"
                  }
                >
                  {/* h-[150px] */}
                  <span className=" bg-[#F2EFEF]  w-full h-full self-center right-0 flex justify-center">
                    {/* <div className="z-40"> */}
                    <img
                      // h-[150px] w-[150px]
                      className=" md:h-[85%] "
                      src={ulayawTD}
                    />
                    {/* </div> */}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    } else if (message.msg && message.msg.welcome) {
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
                  // space-x-2 py-2
                  className={
                    "rounded-[10px] self-center overflow-ellipsis  md:px-4    text-black font-medium text-left h-[150px] md:h-[300px] flex flex-col justify-center w-full"
                  }
                >
                  {/* h-[150px] */}
                  <span className=" bg-[#F2EFEF]  w-full h-full self-center right-0 flex justify-center">
                    {/* <div className="z-40"> */}
                    <img
                      // h-[150px] w-[150px]
                      className=" md:h-[85%] "
                      src={ulayawWelcome}
                    />
                    {/* </div> */}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    } else if (message.msg && message.msg.exit) {
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
                  // space-x-2 py-2
                  className={
                    "rounded-[10px] self-center overflow-ellipsis  md:px-4    text-black font-medium text-left h-[150px] md:h-[300px] flex flex-col justify-center w-full"
                  }
                >
                  {/* h-[150px] */}
                  <span className=" bg-[#F2EFEF]  w-full h-full self-center right-0 flex justify-center">
                    {/* <div className="z-40"> */}
                    <img
                      // h-[150px] w-[150px]
                      className=" md:h-[85%] "
                      src={ulayawExit}
                    />
                    {/* </div> */}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    } else if (message.msg && message.msg.diary) {
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
                  // space-x-2 py-2
                  className={
                    "rounded-[10px] self-center overflow-ellipsis  px-4    text-black font-medium text-left h-[300px] flex flex-col "
                  }
                >
                  <span className=" bg-[#F2EFEF] h-[150px] w-full relative right-0">
                    <div className="z-40">
                      <img
                        // h-[150px] w-[150px]
                        // className=" h-[150px] "
                        src={ulayawTD}
                      />
                    </div>
                  </span>
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
          {/* {!showChatBox ? (
            <>{getMoodStep1 && !showChatBox ? setShowChatBox(true) : ""}</>
          ) : (
            ""
          )} */}

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
                    // to={"/login"}
                    style={{ margin: 3 }}
                    onClick={() => {
                      // df_text_query("Show Thought Diary", false);
                      setQuickRepliesWelcome(false);
                      setShowChatBox(false);
                      setShowModalLogin(true);
                    }}
                    className="bg-[#5DCFFF] text-white rounded-full  p-2 px-4 self-center h-10 cursor-pointer"
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
      message.msg.payload.fields.assessment_ask_companion_replies &&
      assessment_meron_companion_done
    ) {
      return (
        <>
          {assessment_meron_companion_done ? (
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
                    // to={"/login"}
                    style={{ margin: 3 }}
                    onClick={() => {
                      // df_text_query("Show Thought Diary", false);
                      // setQuickRepliesWelcome(false);
                      setShowChatBox(false);
                      // df_event_query("ASSESSMENT_DONE");
                      setShowModalLogin(true);
                      // setassessment_meron_companion_done(false)
                      setassessment_meron_companion(true);
                    }}
                    className="bg-[#5DCFFF] text-white rounded-full  p-2 px-4 self-center h-10 cursor-pointer"
                  >
                    Meron akong kasama
                  </a>
                  <a
                    // to={"/login"}
                    style={{ margin: 3 }}
                    onClick={() => {
                      // console.log(assessmentUser, "cannot read sht");
                      walaAkongCode(assessmentUser);
                    }}
                    // onChange={}
                    // onClick={axios
                    //   .post(`/api/admin/addCompanion`, {
                    //     assessmentUser,
                    //     companion_first_name: "",
                    //     companion_last_name: "",
                    //     companion_contact_no: "",
                    //   })
                    //   .then((res) => {
                    //     // toast.success(res.response.data);
                    //     df_event_query("ASSESSMENT_DONE");
                    //     setShowChatBox(false);
                    //     setassessment_meron_companion(false);
                    //     setassessment_meron_companion_done(false);
                    //     setShowModal(false);
                    //     _handleTranslate(
                    //       `I don't have a companion`,
                    //       `Wala akong ka kasama`,
                    //       true
                    //     );
                    //     _handleTranslate(
                    //       `Salamat sa pagkakataong ibinigay mo upang mapag usapan ang iyong mga suliranin  ${userLoggedIn.first_name}. Base sa ating mga napag usapan, mas makatutulong na ipagpatuloy ang pagproseso ng iyong concerns sa pamamagitan ng psychiatric consultation. Huwag ka sanang mahihiyang lumapit muli sa akin kapag kailangan mo ulit ng aming tulong. Palagi kang mag iingat!`,
                    //       `Salamat sa pagkakataong ibinigay mo upang mapag usapan ang iyong mga suliranin ${userLoggedIn.first_name}. Base sa ating mga napag usapan, mas makatutulong na ipagpatuloy ang pagproseso ng iyong concerns sa pamamagitan ng psychiatric consultation. Huwag ka sanang mahihiyang lumapit muli sa akin kapag kailangan mo ulit ng aming tulong. Palagi kang mag iingat!`
                    //     );

                    //     _handleTranslate(
                    //       `Nais mo na bang ipagpatuloy ang pakikipag usap natin? May ibabahagi sana akong tool sa iyo.`,
                    //       `Nais mo na bang ipagpatuloy ang pakikipag usap natin? May ibabahagi sana akong tool sa iyo.`
                    //     );

                    //     _handleTranslate(
                    //       `Ito ay ginagamit ko paminsan minsan upang ma bawasan ang bigat na aking nararamdaman. 🤗`,
                    //       `Ito ay ginagamit ko paminsan minsan upang ma bawasan ang bigat na aking nararamdaman. 🤗`
                    //     );
                    //   })
                    //   .catch((err) => {
                    //     // setCorrectCode(false);
                    //     // console.log(err.response);
                    //     toast.error(err.response.data.errors);
                    //   })}
                    className="bg-[#5DCFFF] text-white rounded-full  p-2 px-4 self-center h-10 cursor-pointer"
                  >
                    Wala akong kasama
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
      message.msg.payload.fields.multiple_choice &&
      correctCode
    ) {
      // return renderOneMessageStatic("Tama ang code congrats!");
      return (
        <>
          {/* {showChatBox ? setShowChatBox(false) : ""} */}
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
            switchLanguage={switchLanguage}
            // showDiary={true}
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
          <QuickReplies
            text={""}
            key={i}
            replyClick={_handleQuickReplyPayload}
            // onChange={() => {
            //   setShowThoughtDiaryTool(true);
            // }}
            mood_assess={true}
            speaks={message.speaks}
            payload={message.msg.payload.fields.mood_assess.listValue.values}
            // dontShowChatBox={true}
            // showDiary={true}
          />
          {/* {console.log(message)} */}
        </>
      );
    } else if (
      message.msg &&
      message.msg.payload &&
      message.msg.payload.fields &&
      message.msg.payload.fields.select_act &&
      getMoodStep1
    ) {
      return (
        <>
          {showChatBox ? setShowChatBox(false) : ""}
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
                {activatingEvents.map((item, i) => {
                  return (
                    <a
                      style={{ margin: 3 }}
                      onClick={() => {
                        // df_text_query("Show Thought Diary", false);
                        _handleTranslate(item, item, true);
                        setGetMoodStep1(false);
                        setShowChatBox(true);
                        // setShowThoughtDiaryTool(true);
                        // df_event_query("ABC_THOUGHT_DIARY_EXPLAINING_C");
                        setGetAdverseStep3(item);
                        _handleTranslate(
                          `Assume yourself in events. What words describe how you feel or what they are?`,
                          `Ipagpalagay mo ang iyong sarili sa mga kaganapan. Paano mo mailalarawan ang iyong nararamdaman o kinahihinatnan nito?`
                        );
                        _handleTranslate(
                          `Please put a comma in each description.`,
                          `Pakilagyan ng kuwit (coma) ang bawat paglalarawan.`
                        );
                        setFocusThoughtDiaryLetter("c_1");
                        setGetMoodOther(true);
                      }}
                      className="bg-[#5DCFFF] text-white rounded-full  p-2 px-4 self-center h-auto cursor-pointer  flex flex-wrap max-w-[330px] break-all"
                    >
                      {item}
                    </a>
                  );
                })}
              </span>
            </div>
          </div>

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
    }
    // else if (
    //   message.msg &&
    //   message.msg.payload &&
    //   message.msg.payload.fields &&
    //   message.msg.payload.fields.agree_a
    // ) {
    //   return (
    //     <>
    //       {/* {renderOneMessageStatic(
    //         `So, when you mention ${getMoodWhenStartedStep1}, what time and place do you think you first noticed the change in your mood? What makes you feel ${_handleMoods(
    //           getHotEmotionCAnswer
    //         )}? When did it happen? Can you recall where it occur?`
    //       )} */}

    //       {/* {renderOneMessageStatic(
    //         `Answer this question:
    //         ${" "} Was it yesterday? last week? last month? last year? last decade? When did it occur? at school? at work? at home? while playing? while working?  `
    //       )} */}

    //       {activateGetAdverseStep3 === 0 ? setActivateGetAdverseStep3(1) : ""}

    //       {activateGetAdverseStep3 === 2 && !switchLanguage
    //         ? renderOneMessageStatic(
    //             `Okay I got your answer here.'${getAdverseStep3UseState}'`
    //           )
    //         : ""}
    //       {activateGetAdverseStep3 === 2 && switchLanguage
    //         ? renderOneMessageStatic(
    //             `Okay, nakuha ko yung sinagot mo. '${getAdverseStep3UseState}'`
    //           )
    //         : ""}

    //       {activateGetAdverseStep3 === 2 ? (
    //         <div
    //           className={
    //             "flex justify-center space-x-2  p-2 rounded-lg bottom-0 "
    //           }
    //         >
    //           <div
    //             className={
    //               "rounded-[10px] self-center overflow-ellipsis  px-4 py-2  text-black font-medium text-left "
    //             }
    //           >
    //             <span className="flex flex-wrap">
    //               <a
    //                 style={{ margin: 3 }}
    //                 onClick={() => {
    //                   _handleTranslate(
    //                     getAdverseStep3UseState,
    //                     getAdverseStep3UseState,
    //                     true
    //                   );
    //                   // df_text_query(getAdverseStep3UseState, false);
    //                   df_event_query("ABC_THOUGHT_DIARY_EXPLAINING_C");
    //                   _handleTranslate(
    //                     `Okay, so what was that change in your mood that you noticed?  So now I'm in the C) part, which is about the consequences or how you felt afterwards.`,
    //                     `Okay, ano ang pagbabago sa iyong mood na napansin mo? Ngayon ako ay nasa C) na bahagi, na tungkol sa mga kahihinatnan o kung ano ang naramdaman mo pagkatapos.                       `
    //                   );

    //                   _handleTranslate(
    //                     `I want to determine your "Hot Emotion" or what you felt after what you said in the A) part. The exact mood that you thought during those time.`,
    //                     `Gusto kong malaman yung "Hot Emotion" o kung ano yung mood mo pagkatapos ng sinabi mo sa A) na bahagi. Yuung eksaktong naramdaman mo noong panahon na yun.`
    //                   );
    //                   _handleTranslate(
    //                     `So you mentioned earlier about your present mood: '${_handleMoods(
    //                       getHotEmotionCAnswer
    //                     )}'`,
    //                     `Na mention mo kanina sa akin yung present mood mo: '${_handleMoods(
    //                       getHotEmotionCAnswer
    //                     )}'`
    //                   );
    //                   _handleTranslate(
    //                     `Is it still the ones you feel when we go back to the time after you said this: '${getAdverseStep3UseState}' or is your mood different back then? If yes can you identify your mood back then again for me?`,
    //                     `Ito pa rin ba ang nararamdaman mo kapag bumalik tayo sa panahon pagkatapos mong sabihin ito? '${getAdverseStep3UseState}' `
    //                   );
    //                   setActivateGetAdverseStep3(3);
    //                   setGetAdverseStep3(getAdverseStep3UseState);

    //                   setFocusThoughtDiaryLetter("c");
    //                   setShowChatBox(false);
    //                 }}
    //                 className="bg-[#F2EFEF] rounded-full  p-2 px-4 self-center h-10 cursor-pointer"
    //               >
    //                 Now, click here to write it on the thought diary.
    //               </a>
    //             </span>
    //           </div>
    //         </div>
    //       ) : (
    //         ""
    //       )}
    //     </>
    //   );
    // }
    else if (
      message.msg &&
      message.msg.payload &&
      message.msg.payload.fields &&
      message.msg.payload.fields.get_mood_hot &&
      getMoodOther
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
                {getOtherEmotionAll.map((item, i) => {
                  return (
                    <a
                      style={{ margin: 3 }}
                      onClick={() => {
                        // df_text_query("Show Thought Diary", false);
                        _handleTranslate(item, item, true);
                        setGetMoodOther(false);
                        df_event_query("ABC_THOUGHT_DIARY_C_RATE_EMOTION");
                        setGetRateEmotion(true);
                        _handleTranslate(
                          `Can you rate how intense it is (0 "as not intense" to 100 "if severely intense").`,
                          `Maaari mo bang i rate kung gaano ito katindi (0 "bilang hindi matindi" hanggang 100  "kung napaka tindi"). `
                        );
                        setFocusThoughtDiaryLetter("c");
                        setShowChatBox(true);
                        setGetHotEmotionCAnswer([
                          { select: true, mood_text: item },
                        ]);

                        // setShowThoughtDiaryTool(true);
                        // df_event_query("ABC_THOUGHT_DIARY_EXPLAINING_C");
                        // setGetAdverseStep3(item);

                        // setGetMoodHot(true);
                      }}
                      className="bg-[#5DCFFF] text-white flex flex-wrap max-w-[330px] break-all rounded-full  p-2 px-4 self-center h-auto cursor-pointer"
                    >
                      {item}
                    </a>
                  );
                })}
              </span>
            </div>
          </div>
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
      message.msg.payload.fields.pdf_decision &&
      showPDF
    ) {
      return (
        <>
          {showChatBox ? setShowChatBox(false) : ""}
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
                  // to={"/showPDF"}
                  style={{ margin: 3 }}
                  onClick={() => {
                    _handleTranslate(
                      `Oo, Save as PDF`,
                      `Oo, Save as PDF`,
                      true
                    );
                    _handleTranslate(`Okay, Saving...`, `Okay, Saving...`);
                    df_text_query(``, ``, `user`, ``, `exit`);
                    _handleTranslate(
                      `Just come back when you have a problem. If you have comments and feedback to our chatbot. Please don't hesitate to write it at our feedback page. Thank you again.`,
                      `Mag balik ka lang pag may problema ka. Kung mayroon kang mga puna at feedback sa aming chatbot. Huwag sana kayong mag-atubili na isulat ito sa aming feedback page. Salamat muli.`
                    );
                    _handleTranslate(
                      `Do you want to continue chatting with Ulayaw?`,
                      `Gusto mo bang mag patuloy sa pakikipag usap kay Ulayaw?`
                    );
                    setRestart(true);
                    // window.location.reload();
                    df_event_query("ASSESSMENT_DONE");
                    let email = isAuth().email;
                    let formData = [];
                    formData.push({
                      presentEmotion: showPresentEmotion.map((item, i) => {
                        return _handleMoodResultGetHotEmotionCAnswer(item, i);
                      }),
                    });
                    formData.push({ step1ActivatingEvents: activatingEvents });
                    formData.push({ step1SelectedAE: getAdverseStep3 });
                    formData.push({ step2Other: getOtherEmotionAll });
                    formData.push({
                      step3Hot: getHotEmotionCAnswer.map((item, i) => {
                        return _handleMoodResultGetHotEmotionCAnswer(item, i);
                      }),
                    });
                    formData.push({ step3Rate: getHotEmotionRate });
                    formData.push({ step4Thoughts: getOtherThoughtB });
                    formData.push({ step5AfterFeelings: getAfterFeelingsChat });
                    // showChatBox(false);
                    axios
                      .post(`/api/admin/thoughtDiary`, {
                        formData,
                        email,
                      })
                      .then((res) => {
                        toast.success(res.data.message);
                        setCorrectCode(true);
                        console.log(res.data.user);
                        setAssessmentUser(res.data.user);
                        setShowChatBox(false);
                        // toast.success(res.data.message);
                      })
                      .catch((err) => {
                        setCorrectCode(false);
                        setShowChatBox(true);
                        // console.log(err.response);
                        toast.error(err.response.data.errors);
                      });
                    // <PdfExtract />;
                    setShowThoughtDiaryTool(false);
                    handleExportWithComponent();
                    setShowChatBox(false);
                    setShowPDF(false);
                  }}
                  className="bg-[#5DCFFF] text-white rounded-full  p-2 px-4 self-center h-10 cursor-pointer"
                >
                  Oo, Save as PDF
                </a>
                <a
                  style={{ margin: 3 }}
                  onClick={() => {
                    setShowThoughtDiaryTool(false);
                    _handleTranslate(`No`, `Hindi,`, true);
                    _handleTranslate(`Okay, Thank you!`, `Okay, Thank you!`);
                    df_text_query(``, ``, `user`, ``, `exit`);
                    _handleTranslate(
                      `Just come back when you have a problem. If you have comments and feedback to our chatbot. Please don't hesitate to write it at our feedback page. Thank you again.`,
                      `Mag balik ka lang pag may problema ka. Kung mayroon kang mga puna at feedback sa aming chatbot. Huwag sana kayong mag-atubili na isulat ito sa aming feedback page. Salamat muli.`
                    );
                    _handleTranslate(
                      `Do you want to continue chatting with Ulayaw?`,
                      `Gusto mo bang mag patuloy sa pakikipag usap kay Ulayaw?`
                    );
                    setRestart(true);
                    // window.location.reload();
                    df_event_query("ASSESSMENT_DONE");
                    let email = isAuth().email;
                    let formData = [];
                    formData.push({
                      presentEmotion: showPresentEmotion.map((item, i) => {
                        return _handleMoodResultGetHotEmotionCAnswer(item, i);
                      }),
                    });
                    formData.push({ step1ActivatingEvents: activatingEvents });
                    formData.push({ step1SelectedAE: getAdverseStep3 });
                    formData.push({ step2Other: getOtherEmotionAll });
                    formData.push({
                      step3Hot: getHotEmotionCAnswer.map((item, i) => {
                        return _handleMoodResultGetHotEmotionCAnswer(item, i);
                      }),
                    });
                    formData.push({ step3Rate: getHotEmotionRate });
                    formData.push({ step4Thoughts: getOtherThoughtB });
                    formData.push({ step5AfterFeelings: getAfterFeelingsChat });
                    setShowChatBox(false);
                    axios
                      .post(`/api/admin/thoughtDiary`, {
                        formData,
                        email,
                      })
                      .then((res) => {
                        toast.success(res.data.message);
                        setCorrectCode(true);
                        console.log(res.data.user);
                        setAssessmentUser(res.data.user);
                        setShowChatBox(false);
                        // toast.success(res.data.message);
                      })
                      .catch((err) => {
                        setCorrectCode(false);
                        setShowChatBox(true);
                        // console.log(err.response);
                        toast.error(err.response.data.errors);
                      });
                    setShowPDF(false);
                  }}
                  className="bg-[#5DCFFF] text-white rounded-full  p-2 px-4 self-center h-10 cursor-pointer"
                >
                  Hindi
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
                        className="bg-[#5DCFFF] text-white rounded-full  p-2 px-4 self-center h-auto flex flex-wrap cursor-pointer"
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
                      className="bg-[#5DCFFF] text-white flex flex-wrap max-w-[330px] break-all rounded-full  p-2 px-4 self-center  cursor-pointer"
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
                    className="bg-[#5DCFFF] text-white flex flex-wrap max-w-[330px] break-all rounded-full  p-2 px-4 self-center cursor-pointer"
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
                  className="bg-[#5DCFFF] text-white rounded-full  p-2 px-4 self-center h-10 cursor-pointer"
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
                  className="bg-[#5DCFFF] text-white rounded-full  p-2 px-4 self-center h-10 cursor-pointer"
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
                  className="bg-[#5DCFFF] text-white rounded-full  p-2 px-4 self-center h-10 cursor-pointer"
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
                  className="bg-[#5DCFFF] text-white rounded-full  p-2 px-4 self-center h-10 cursor-pointer"
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
  function _handleMoodsTag(moodContainer) {
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
        // res += moodContainer[i].mood_text;

        if (moodContainer[i].mood_text === "sad") {
          res += "malungkot";
        }

        if (moodContainer[i].mood_text === "worried") {
          res += "nag-aalala";
        }
        if (moodContainer[i].mood_text === "frustrated") {
          res += "bigo";
        }
        if (moodContainer[i].mood_text === "guilty") {
          res += "nagkasala";
        }

        if (moodContainer[i].mood_text === "nervous") {
          res += "kinakabahan";
        }

        if (moodContainer[i].mood_text === "embarrased") {
          res += "nahihiya";
        }
        if (moodContainer[i].mood_text === "angry") {
          res += "galit";
        }
        if (moodContainer[i].mood_text === "anxious") {
          res += "balisa";
        }
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
      _handleTranslate(
        `Which one do you think might be a "${title}"`,
        `Alin sa tingin mo dito ang "${title}"?`
      );
      setGetUTS(title);
    }
    setGetUTSThoughtBool(true);
    df_event_query("ABC_THOUGHT_DIARY_SELECT_UTS_THOUGHT");
  }

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

  // useEffect(() => {
  //   const timer = setTimeout(() => console.log("Initial timeout!"), 1000);
  //   return () => clearTimeout(timer);
  // }, [messages]);

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
        {/* md:w-96 xl bottom-[120px]  */}
        {showBot ? (
          <div
            className={
              showThoughtDiaryTool
                ? "flex flex-col  md:w-[500px] shadow-lg w-screen border-2    bg-white right-0 bottom-0 md:bottom-5 md:right-5  rounded-[20px] fixed  h-2/3 md:h-5/6 z-40"
                : "flex flex-col  md:w-[500px] shadow-lg w-screen border-2    bg-white right-0 bottom-0 md:bottom-5 md:right-5  rounded-[20px] fixed h-[95%] md:h-5/6   z-40"
              // h-screen md:h-5/6
            }
          >
            {/* nav */}
            <nav className="border-b-[3px] border-[#E4E4E4]">
              <div className="p-4 flex flex-row justify-between ">
                <div className="flex  text-[#5DCFFF] text-[20px]  font-normal">
                  <span className="mr-2 self-center h-2 w-2 shadow-lg   rounded-full  bg-green-400 "></span>
                  <p>Ulayaw</p>
                </div>
                <ul className="right-0 cursor-pointer text-white font-semibold rounded-md bg-[#5DCFFF] h-[20px] md:h-[28px] w-[120px] md:w-[200px] flex justify-center transform hover:scale-[1.050] hover:opacity-80 self-center">
                  <li className=" ">
                    <p
                      // href="/"
                      // onClick={() => {
                      //   setShowBot(!showBot);
                      // }}
                      className="text-[12px] md:text-[17px] select-none"
                      onClick={() => {
                        setSwitchLanguage(!switchLanguage);
                        // handleExportWithComponent();
                      }}
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
                          {switchLanguage
                            ? `Kaibigan, ang pakikipag-usap na ito ay pribado. Ang
                          iyong pagkakakilanlan ay protektado at may siguridad
                          ang bawat impormasyon mababanggit. Maaaring basahin
                          muna ang`
                            : `Friend, this conversation is private. Your identity is protected and you have to make sure every information is mentioned. The`}
                          <button
                            className="pl-1 underline font-bold text-[#5DCFFF] cursor-pointer transform hover:scale-105"
                            onClick={() => {
                              setShowModal(true);
                            }}
                          >
                            {switchLanguage ? `kondisyon` : `condition`}
                            {/* kondisyon */}
                          </button>{" "}
                          {switchLanguage
                            ? `upang makapag patuloy.`
                            : `can be read first to proceed.`}
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
                {/* <input
                  className=" focus:ring-1 focus:ring-[#5DCFFF] p-4 outline-none w-full rounded-b-[20px]"
                  type="text"
                  onKeyPress={_handleInputKeyPress}
                  placeholder="Iyong Mensahe ..."
                  ref={(input) => {
                    talkInput = input;
                  }}
                  disabled={!cookies.get("termsAndConditions")}
                /> */}
                <Textarea
                  autoSize={{ minRows: 1, maxRows: 3 }}
                  onResize={onResize}
                  value={value}
                  onChange={onChange}
                  className="  p-4 outline-none w-full rounded-b-[20px] mr-8 overflow-y-auto"
                  type="text"
                  // onChange={_handleInputKeyPress}
                  onKeyPress={_handleInputKeyPress}
                  // onPressEnter={_handleInputKeyPress}
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
              className=" h-[50px] transform scale-[0.70] md:scale-[1] bottom-10 right-2 md:right-10 z-40 fixed  "
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
            userLoggedIn={userLoggedIn}
            df_event_query={df_event_query}
            df_text_query={df_text_query}
            _handleTranslate={_handleTranslate}
            assessment_meron_companion={assessment_meron_companion}
            setassessment_meron_companion={setassessment_meron_companion}
            setAssessmentUser={setAssessmentUser}
            assessmentUser={assessmentUser}
            setassessment_meron_companion_done={
              setassessment_meron_companion_done
            }
            assessment_meron_companion_done={assessment_meron_companion_done}
            // history={props.history}
          />
        ) : (
          ""
        )}

        {/* <DisplayBot talkInput={talkInput} messagesEnd={messagesEnd} /> */}
      </div>
      <div className="z-0 ">
        {showThoughtDiaryTool ? (
          <PDFExport
            ref={pdfExportComponent}
            scale={0.8}
            paperSize="A4"
            // landscape={true}
          >
            <ThoughtDiary />
          </PDFExport>
        ) : (
          ""
        )}
      </div>
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

function ModalTermsAndConditions({ showModal, setShowModal }) {
  return (
    <div className="fixed top-0 w-full h-full bg-black bg-opacity-[0.75] z-50">
      <div className="h-full flex flex-col  justify-center align-center">
        {/* header */}
        <div className="w-full md:w-3/4 rounded-t-[10px] text-[20px] lg:text-[26px] p-[18px] lg:p-[28px]  text-white self-center bg-[#5DCFFF] font-semibold">
          <p>Terms and Condition</p>
        </div>

        {/* body */}
        <div className="w-full md:w-3/4 rounded-b-[10px] text-[12px] lg:text-[16px] p-[18px] md:px-[71px] py-[55px] self-center bg-white grid overflow-auto">
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

function ThoughtDiary() {
  const { getAdverseStep3, setGetAdverseStep3 } = useContext(
    GetAdverseAnswerContext
  );
  const { continueThoughtDiary, setContinueThoughtDiary } = useContext(
    ContinueThoughtDiaryContext
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
  const { getInterpretations, setGetInterpretations } = useContext(
    GetInterpretationsContext
  );
  const { getLocation, setGetLocation } = useContext(GetLocationContext);
  const { showPresentEmotion, setShowPresentEmotion } =
    useContext(PresentEmotion);

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
    <div className="h-[3000px] md:h-[1000px]">
      <div className="left-0 top-0  w-full h-full  bg-opacity-[0.60] z-20 md:z-0  mb-6">
        <div className="w-full items-start flex md:justify-center flex-col  xl:w-[1350px] xl:pl-[24px] pt-[26px] h-[3000px] md:h-[1000px]  transform scale-[0.95] md:scale-[1.0]">
          {/* header */}
          <div className=" w-[215px] h-[54px] rounded-t-[15px] ml-2 text-[20px] lg:text-[24px] p-[18px] lg:pt-[11px] px-[23px] text-white self-start bg-[#49c3f7] font-bold">
            <p>Thought Diary</p>
          </div>

          {/* body */}
          {/* bg-black bg-opacity-[0.75] text-opacity-0  */}
          <div
            className={
              focusThoughtDiaryLetter != null
                ? "bg-[#5DCFFF] w-full md:w-[655px] rounded-b-[15px]  self-start  grid grid-cols-1 md:grid-cols-2  h-[1500px] md:min-h-[750px]  text-white font-semibold  "
                : "w-full md:w-[655px] rounded-b-[15px] self-start  grid grid-cols-1 md:grid-cols-2  h-[1500px] md:min-h-[750px] text-[#4CC2F4] text-[20px] font-semibold bg-white"
            }
          >
            {/* A and C */}
            <div className="w-[327.5px] border-l-4 border-b-4 md:border-r-0 border-r-4 border-t-4 border-[#86A1AC] rounded-b-[15px]  grid grid-rows-6 max-h-[750px]">
              {/* section 1 */}
              <div
                className={
                  focusThoughtDiaryLetter === "a" ||
                  focusThoughtDiaryLetter === "a_b" ||
                  focusThoughtDiaryLetter === "a_1" ||
                  focusThoughtDiaryLetter === "c_1" ||
                  focusThoughtDiaryLetter === "a_c"
                    ? "border-b-4 border-[#86A1AC] bg-white text-[#4CC2F4] row-span-3 rounded-b-[15px] "
                    : "border-b-4 border-[#86A1AC] row-span-3 rounded-b-[15px] "
                }
              >
                <div className=" p-4 break-words ">
                  <label className="text-[20px] ">A) Activating Event</label>
                  <div className="flex flex-col leading-none  text-[32px] text-center ">
                    {focusThoughtDiaryLetter === "a_1" ? (
                      <>
                        <label className="text-[14px] font-normal text-justify text-blue-900 w-full  py-2 px-2 space-y-2">
                          (What happened? What did I do? What did others do?
                          What idea occurred to me? What’s stressing me out?)
                        </label>
                        <label className="text-[14px] text-blue-900  font-bold w-full">
                          This may be either: an actual event or situation, a
                          thought, mental picture or recollection.
                        </label>
                      </>
                    ) : (
                      ""
                    )}

                    <label
                      className="max-w-[300px] max-h-[250px]
                    text-[16px]"
                    >
                      {/* Crying out loud last week */}
                      {getAdverseStep3}
                    </label>
                  </div>
                  {focusThoughtDiaryLetter === "a_1" ? (
                    <div className="z-40">
                      <img src={ulayawA} />
                    </div>
                  ) : (
                    ""
                  )}
                  {focusThoughtDiaryLetter === "c_1" ? (
                    <div className="z-40">
                      <img src={ulayawC} />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              {/* section 2 */}
              <div
                className={
                  focusThoughtDiaryLetter === "c" ||
                  focusThoughtDiaryLetter === "b_c" ||
                  focusThoughtDiaryLetter === "c_1" ||
                  focusThoughtDiaryLetter === "a_c"
                    ? " bg-white p-4 text-[#4CC2F4] row-span-3 rounded-[15px]"
                    : " p-4 row-span-3 rounded-[15px]"
                }
              >
                <label className="text-[20px] ">C) Consequences</label>
                <div className=" text-center break-words max-w-[300px]">
                  {/* Present emotion section */}
                  <label className="flex flex-col leading-none">
                    <label>
                      <label className="text-[14px] text-blue-900  font-bold">
                        present emotion
                      </label>
                    </label>

                    <label className="">
                      {showPresentEmotion != null ||
                      (showPresentEmotion != undefined &&
                        getAdverseStep3 != null) ||
                      getAdverseStep3 != undefined
                        ? showPresentEmotion.map((item, i) => {
                            return (
                              <>
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

                  {/* Hot emotion section */}
                  <label className="flex flex-col leading-none">
                    <label>
                      {/* {focusThoughtDiaryLetter === "a_1" ? (<></>):""} */}
                      {focusThoughtDiaryLetter === "c_1" ? (
                        <>
                          <ol className="text-[14px] text-justify text-blue-900 font-normal  py-2 px-2 space-y-2">
                            <li>
                              1. Write down words describing how you feel.
                            </li>
                            <li>
                              2. Mark the one that is most associated with the
                              activating event.
                            </li>
                            <li>
                              3. Rate the intensity of that feeling (0 to 100).
                            </li>
                          </ol>
                        </>
                      ) : (
                        ""
                      )}
                      <label className="text-[14px] text-blue-900  font-bold">
                        hot emotion: rated {getHotEmotionRate}/100
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
                            // if (item.select && firstHit === -1) {
                            //   firstHit = i;
                            // }
                            return (
                              <>
                                {/* {item} */}
                                {/* {item.select && i != firstHit ? (
                                  <span className="text-[50px] leading-[0px]">
                                    ,
                                  </span>
                                ) : (
                                  ""
                                )} */}
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
                      {focusThoughtDiaryLetter === "c_1" ? (
                        <>
                          <ol className="text-[14px] text-justify text-blue-900 font-normal  py-2 px-2 space-y-2">
                            <li>
                              4. Jot down any physical sensations you
                              experienced or actions carried out.
                            </li>
                          </ol>
                        </>
                      ) : (
                        ""
                      )}
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
            <div className="w-[327.5px] rounded-b-[15px]  border-l-4 border-r-4 border-b-4 border-t-4 border-[#86A1AC] grid grid-rows-6 ">
              {/* section 1 */}
              <div
                className={
                  focusThoughtDiaryLetter === "b" ||
                  focusThoughtDiaryLetter === "b_c" ||
                  focusThoughtDiaryLetter === "a_b" ||
                  focusThoughtDiaryLetter === "b_1"
                    ? "pb-4 bg-white p-4 text-[#4CC2F4] row-span-4 border-b-4 border-[#86A1AC] max-h-[750px]"
                    : "pb-4 p-4 row-span-4 border-b-4 border-[#86A1AC] max-h-[750px]"
                }
              >
                <label className="text-[20px] ">B) Beliefs</label>
                <div className="text-center break-words max-w-[290px]">
                  {/* hot thought */}
                  {/* {continueThoughtDiary ? ( */}
                  <label className="flex flex-col leading-none">
                    <label>
                      <label className="text-[14px] text-blue-900  font-bold">
                        thoughts of the event
                      </label>
                    </label>
                    <label>
                      {focusThoughtDiaryLetter === "b_1" ? (
                        <>
                          <ol className="text-[14px] text-justify text-blue-900 font-normal py-2 px-2 space-y-2">
                            <li>
                              1. List all statements that link A to C. Ask
                              yourself "What was I thinking?" "What was I saying
                              to myself?" "What was going through my head at the
                              time?".
                            </li>
                            {/* <li>
                                2. Find the most distressing (hot) thought and
                                underline it.
                              </li>
                              <li>
                                3. Rate how much you believe this thought
                                between (0 to 100).
                              </li> */}
                          </ol>
                        </>
                      ) : (
                        ""
                      )}
                      {/* <label className="text-[14px] text-blue-900  font-bold">
                          the hot thought: rated {getHotThoughtRate}/100
                        </label> */}
                    </label>

                    {/* <label className=""> */}
                    {/* {getHotThoughtB[0]} */}
                    {/* I'm always going to feel depressed
                    <span className="text-[50px] leading-[0px]">.</span> */}
                    {/* </label> */}
                  </label>
                  {/* ) : (
                    ""
                  )} */}

                  {/* other thoughts */}
                  <label className="flex flex-col leading-none pt-10">
                    {continueThoughtDiary ? (
                      <label className="text-[14px] text-blue-900  font-bold">
                        your thoughts
                      </label>
                    ) : (
                      ""
                    )}
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

                  {focusThoughtDiaryLetter === "b_1" ? (
                    <div className="z-40">
                      <img src={ulayawB} />
                    </div>
                  ) : (
                    ""
                  )}
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
                <label className="flex flex-col leading-none">
                  <label>
                    <label className="text-[14px] text-blue-900  font-bold">
                      interpretation(s)
                    </label>
                  </label>
                </label>
                <label className="">
                  {/* {_handleShowList(getOtherThoughtB)} */}
                  {getInterpretations != null || getInterpretations != undefined
                    ? getInterpretations.map((item, i) => {
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
                {/* The hot thought Unhelpful Thinking Styles */}
                {continueThoughtDiary ? (
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
                ) : (
                  ""
                )}
                {/* Other Unhelpful Thinking Styles  */}
                {continueThoughtDiary ? (
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
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default withRouter(Chatbot);
