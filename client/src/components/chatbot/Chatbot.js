import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios/index";
import Message from "./Message";
import Card from "./Card";
import Cookies from "universal-cookie";
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

import { useDrop } from "react-dnd";
import UTSCard from "./UTSCard";
import UTS from "../UTS";

const cookies = new Cookies();

function Chatbot(props) {
  const [messages, setMessages] = useState([]);
  const [showBot, setShowBot] = useState(true);
  const [shopWelcomeSent, setShopWelcomeSent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [claimCode, setClaimCode] = useState(false);
  const [correctCode, setCorrectCode] = useState(false);
  const [assessmentScore, setAssessmentScore] = useState();
  // const { showMoods, setShowMoods } = useContext(ShowMoodsContext);
  const { showChatBox, setShowChatBox } = useContext(ShowChatBox);
  const { maxInput, setMaxInput } = useContext(MaxInputContext);
  const { focusThoughtDiaryLetter, setFocusThoughtDiaryLetter } = useContext(
    ThoughtDiaryFocusContext
  );

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

  let messagesEnd = useRef(null);
  let talkInput = useRef(null);

  if (cookies.get("userID") === undefined) {
    cookies.set("userID", uuid(), { path: "/" });
  }

  async function df_text_query(queryText, dfQuery, speaker) {
    console.log(speaker);
    if (speaker === undefined) speaker = "user";
    let says = {
      // speaks: "user",
      speaks: speaker,
      msg: {
        text: {
          text: queryText,
        },
      },
    };

    setMessages((prevMessages) => {
      return [...prevMessages, says];
    });

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

    console.log(messages);
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
  useEffect(async () => {
    df_event_query("Welcome");
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
  }, []);

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
        setActivateGetAdverseStep3(2);
        setShowChatBox(false);
        // console.log(getAdverseStep3);
      } else if (getMoodOther) {
        if (e.target.value !== "") {
          df_text_query(e.target.value, false);
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
          }
          // console.log(getOtherEmotionAll, "just the two of us");

          // console.log(getMoodAfterFeelngs);
          // setGetMoodFeelings(true);
        } else {
          df_text_query("Please put anything in the chatbox", false, "bot");
        }
      } else if (getRateEmotion) {
        let chat = e.target.value;
        if (e.target.value !== "") {
          if (parseInt(chat) != NaN) {
            chat = parseInt(chat);
            if (chat <= 0 || chat > 10) {
              df_text_query("Please put a number between (1-10)", false, "bot");
            } else {
              if (chat > 0 && chat < 6) {
                df_text_query(chat, false);
                df_text_query(
                  `Okay, that wasn't so strong. However, you mentioned experiencing these things that affected you.
                  '${_handleMoods(getHotEmotionCAnswer)}' and
                '${_handleShowList(getOtherEmotionAll)}'`,
                  false,
                  "bot"
                );
              }
              if (chat > 5 && chat <= 10) {
                df_text_query(chat, false);
                df_text_query(
                  `Okay, that's pretty strong. It's not surprising that you've noticed that these things affected you. 
                  
                  '${_handleMoods(
                    getHotEmotionCAnswer
                  )}' and '${_handleShowList(getOtherEmotionAll)}'`,
                  false,
                  "bot"
                );
              }
              df_text_query(
                `Okay, so now we kind of have an idea that this is what happened. '${getAdverseStep3}'. This is the time and place you noticed the change in your mood. `,
                false,
                "bot"
              );
              df_text_query(
                `And these are the emotions you noticed. '${_handleMoods(
                  getHotEmotionCAnswer
                )}' and
                '${_handleShowList(
                  getOtherEmotionAll
                )}'. And you mentioned that you're still feeling some of them now `,
                false,
                "bot"
              );

              df_text_query(
                `Okay, so what was on your mind if we could go back '${getMoodWhenStartedStep1}' to the time and place when you said: '${getAdverseStep3}'.`,
                false,
                "bot"
              );

              df_text_query(
                `Answer the question "What was going through my head at the time?`,
                false,
                "bot"
              );

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
          setGetAfterFeelingsChat(chat);
          setGetRateEmotion(true);
          df_event_query("ABC_THOUGHT_DIARY_C_RATE_EMOTION");
          df_text_query(chat, false);
        } else {
          df_text_query("Please put anything in the chatbox", false, "bot");
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
            df_text_query(chat, false);
            df_text_query(
              `Are you starting to get a feeling now for why that '${_handleMoods(
                getHotEmotionCAnswer
              )}' kind of feeling might have been so ${
                getHotEmotionRate > 5 ? "Strong" : "Slightly Strong"
              }. It's quite a good match if we look at B) and C)`,
              false,
              "bot"
            );

            setFocusThoughtDiaryLetter("b_c");
            df_text_query(
              `Is there any other thoughts that you have? if we could go back "recently" to the time and place when you said: ${getAdverseStep3}`,
              false,
              "bot"
            );

            setMaxInput(2);
          }

          if (maxInput === 2) {
            df_text_query(chat, false);
            df_text_query(
              `Okay, given that you think that way, when we look at the C) column, it's kind of a match for you that you couldn't figure out why you were feeling that way.`,
              false,
              "bot"
            );
            df_text_query(
              `Give me 2 more of your thoughts during that time.`,
              false,
              "bot"
            );

            setFocusThoughtDiaryLetter("b_c");
            setMaxInput(3);
          }
          if (maxInput === 3) {
            df_text_query(chat, false);
            df_text_query(
              `Was there any other thoughts that you noticed at the time?
              `,
              false,
              "bot"
            );

            setFocusThoughtDiaryLetter("b");
            setMaxInput(4);
          }

          if (maxInput === 4) {
            df_text_query(chat, false);
            df_text_query(
              `Okay wow, that's a lot of things. And looking at that I'm thinking there's quite a few things that it might be really helpful for us to have a bit of a look at.
              `,
              false,
              "bot"
            );
            df_text_query(
              `Um, because if these things were true: '${_handleShowList(
                getOtherThoughtB
              )}'
              `,
              false,
              "bot"
            );
            df_text_query(
              `then we'd really have a problem, like it would require a professional to kind of focus on fixing that problem.
              `,
              false,
              "bot"
            );
            df_text_query(
              `But I'm wondering whether some of these thoughts could be a reflection of your true problem; they could be the one component that, although not exactly accurate, are a component of your true problem.
              `,
              false,
              "bot"
            );
            df_text_query(
              `And if that's true we might be able to adjust them or think a little differently about the situation and hopefully feel a bit differently as a result.
              `,
              false,
              "bot"
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
          df_text_query("Please put anything in the chatbox", false, "bot");
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
              setGetExplainDBool(true);
              df_event_query("ABC_THOUGHT_EXPLAIN_D");
              setFocusThoughtDiaryLetter("b_c");
              setShowChatBox(false);
              setMaxInput(0);
            }
            console.log(chat);
          }
        } else {
          df_text_query("Please put anything in the chatbox", false, "bot");
        }
      } else if (getExplainDBool) {
        let chat = e.target.value;
        // console.log(getUTS.length);

        if (e.target.value !== "") {
          // if (maxInput === 1) {
          df_text_query(chat, false, "user");
          setShowChatBox(false);
          setGetForEvidenceD((x) => {
            return [...x, chat];
          });
          console.log(getForEvidenceD, "getForEvidenceD");
          df_event_query("ABC_THOUGHT_EXPLAIN_D");
          // }
        } else {
          df_text_query("Please put anything in the chatbox", false, "bot");
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

  function _handleQuickReplyPayload(event, payload, text) {
    if (text != "I have a code") {
      df_text_query(text, false);
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
      case "training_masterclass":
        df_event_query("MASTERCLASS");
        break;
      case "training_demographics-continue":
        // setShowMoods(true);
        df_event_query("ABC_GETMOOD");
        break;
      case "abc_continue_step_1":
        df_event_query("ABC_GETMOOD");
        break;
      case "proceed_to_a":
        setFocusThoughtDiaryLetter("a");
        df_event_query("ABC_THOUGHT_DIARY_EXPLAINING_A");
        break;
      case "show_thought_diary":
        setGetMoodWhenStartedStep1(text);
        return df_event_query("ABC_THOUGHT_DIARY_NOT_INTRO");
      case "yes_mood_different":
        // setShowMoods(true);
        break;
      case "abc_explaining_c_nothing":
        df_event_query("ABC_THOUGHT_DIARY_C_RATE_EMOTION");
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
        df_text_query(
          `Okay, um, before  we kind of leap into that, the idea of kind of challenging or getting curious about some of those thoughts.
          `,
          false,
          "bot"
        );
        df_text_query(
          `There's one more thing thing I wanted to do and that was to have a look and see if we could notice any of those unhelpful thinking styles.
            `,
          false,
          "bot"
        );
        df_text_query(
          `Now, I'm just going to show you this graphic interface about unhelpful thinking styles.
            `,
          false,
          "bot"
        );

        df_text_query(
          `I want you to remember that these were the things that are really common when people are having problem and they start to think in these characteristic ways and some of them you'll notice happening for you a lot of the time and some not so much.
            `,
          false,
          "bot"
        );
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

        df_text_query(
          `I'm just wondering that when you look at these thoughts here: 
          '${_handleShowList(getOtherThoughtB)}'`,
          false,
          "bot"
        );
        df_text_query(
          `
          Is there any of those unhelpful thinking styles that pop out at you that will let you think. "Yeah I reckon that could be a bit of what's happening".
          
            `,
          false,
          "bot"
        );
        df_text_query(
          `Read the Description only for now, disregard the Disputation Questions.`,
          false,
          "bot"
        );
        df_text_query(
          `Are you ready to start identifying your unhelpful thinking styles?`,
          false,
          "bot"
        );

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
        df_text_query(
          `Click one of the Unhelpful Thinking Styles below! `,
          false,
          "bot"
        );
        break;
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
        df_text_query(text, true);
        break;
    }
  }

  function _handleAssessmentResult(total) {
    let res = "";
    if (total >= 7) res = "high";
    if (total < 7) res = "low";

    console.log("Assessment Result:", res, "Assessment Total:", total);

    df_event_query("ASSESSMENT_DONE");
    setClaimCode(false);
  }

  function _handleMoodResult() {
    df_text_query(_handleMoods(selectedMoods), false);
    df_event_query("ABC_STEP1_MOOD_ASSESS");
    setGetMoodStep1(true);
    // setShowMoods(false);
    // df_event_query("ASSESSMENT_DONE");
    // setClaimCode(false);
  }

  function _handleHotMoodResult() {
    setGetMoodHot(true);
    df_text_query(_handleMoods(selectedMoods), false);
    df_event_query("ABC_THOUGHT_DIARY_C_OTHER_MOOD");

    // setShowMoods(false);
    // df_event_query("ASSESSMENT_DONE");
    // setClaimCode(false);
  }

  function _handleOtherMoodResult() {
    setGetMoodOther(true);
    setShowMoodsOther(false);
    df_text_query(_handleMoods(getOtherEmotionCAnswer), false);
    if (maxInput === 5) {
      setGetMoodOther(false);
      // df_text_query(_handleMoods(getOtherEmotionCAnswer), false);
      setMaxInput(0);
      df_event_query("ABC_THOUGHT_DIARY_C_AFTER_MOODS");
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
                <img src="ulayaw.png" />
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
      return (
        <Message key={i} speaks={message.speaks} text={message.msg.text.text} />
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

          {renderOneMessageStatic(
            message.msg.payload.fields.mood_assess_text.stringValue
          )}
          <QuickReplies
            text={
              message.msg.payload.fields.mood_assess_text.stringValue
                ? message.msg.payload.fields.mood_assess_text.stringValue
                : null
            }
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
                      setShowThoughtDiaryTool(true);
                      // setShowChatBox(true);
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
      message.msg.payload.fields.agree_a
    ) {
      return (
        <>
          {renderOneMessageStatic(
            `So, when you mention '${getMoodWhenStartedStep1}' what time and place do you think you first noticed the change in your mood? `
          )}

          {renderOneMessageStatic(
            `Answer this question: 
            ${" "} Was it yesterday? last week? last month? last year? last decade? When did it occur? at school? at work? at home? while playing? while working? Try to put it in a lesser sentence so that we can fit it here in the thought diary. `
          )}

          {activateGetAdverseStep3 === 0 ? setActivateGetAdverseStep3(1) : ""}

          {activateGetAdverseStep3 === 2
            ? renderOneMessageStatic(
                `
            Okay I got your answer here.'${getAdverseStep3UseState}' `
              )
            : ""}

          {activateGetAdverseStep3 === 2 && getAdverseStep3 === null ? (
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
                      df_text_query(getAdverseStep3UseState, false);
                      df_event_query("ABC_THOUGHT_DIARY_EXPLAINING_C");
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
          {renderOneMessageStatic(
            `So you mentioned earlier about your present mood(s): '${_handleMoods(
              getHotEmotionCAnswer
            )}' `
          )}

          {renderOneMessageStatic(
            `Is it still the ones you feel when we go back to the time after you said this: '${getAdverseStep3}' or is your mood different back then? If yes can you identify your mood back then again for me? `
          )}

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

          {renderOneMessageStatic(`Okay, so I understand that you've had to
              deal with a lot of the consequences. However, these are only a few
              of the ones I noted. '${_handleMoods(getHotEmotionCAnswer)}' and
              '${_handleShowList(getOtherEmotionAll)}'`)}
          {getAfterFeelings
            ? renderOneMessageStatic(`And you did this after experiencing the
              consequences.'${getAfterFeelingsChat}'`)
            : ""}
          {renderOneMessageStatic(
            `Okay, so that '${_handleMoods(
              getHotEmotionCAnswer
            )}' feeling, um... When you say you felt it '${getMoodWhenStartedStep1}' give me an idea of how strong it was.`
          )}
          {renderOneMessageStatic(
            `If you had to give it a rating out of ten (1-10), how would you rate it?`
          )}
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
        <div
          className={"flex justify-center space-x-2  p-2 rounded-lg bottom-0 "}
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
    setGetHotThoughtB(item);
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
      df_event_query("ABC_THOUGHT_EXPLAIN_D");
    }
    if (maxInput === 1) {
      df_text_query(
        `So we'll start with for. These ones you probably find are coming to mind pretty easy. `,
        false,
        "bot"
      );
      df_text_query(
        `So I'm just gonna focus on the for. And then tell me what would be your sort of your main reasons in choosing this belief: "${getHotThoughtB}"`,
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
        `Okay, I can imagine that would be the main piece of evidence. Is there other things that you would see as evidence for this belief: "${getHotThoughtB}"`,
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
    if (maxInput === 3) {
      df_text_query(
        `Okay, I'm gonna leave that there for the moment we might need to go back and tweak that one a little bit as we go along.`,
        false,
        "bot"
      );
    }
    setMaxInput(maxInput + 1);
    focusThoughtDiaryLetter("d");
  }
  function _handleUTSQuickReply(item, i) {
    df_text_query(item, false, "user");
    let UTSformat = { title: getUTS, thought: item };
    if (getUTSContainerState.length === 0) {
      setGetUTSCointainerState([item]);
      setGetUTSCointainer(UTSformat);
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
      df_text_query(title, false, "user");

      df_text_query(
        `Which one of these do you think might be it because I think you're probably right.`,
        false,
        "bot"
      );

      // console.log(getOtherThoughtB);
      df_text_query(
        `Which one do you think might be a "${title}"`,
        false,
        "bot"
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
    if (cookies.get("termsAndConditions")) {
      if (returnedMessages) {
        // console.log(returnedMessages);

        return returnedMessages.map((message, i) => {
          // console.log(i);
          return renderOneMessage(message, i);
        });
      } else {
        return null;
      }
    }
  }

  useEffect(() => {
    if (showChatBox && showBot) {
      talkInput.focus();
    }
    messagesEnd.scrollIntoView({ behavior: "smooth" });
    // console.log(talkInput);
    if (talkInput.current != null) {
      talkInput.focus();
    }
  });

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
      <div className="z-40">
        {showBot ? (
          <div className="flex flex-col  md:w-96 xl:w-[500px] shadow-lg w-full border-2  bottom-0 bg-white right-0 md:bottom-5   md:right-5  rounded-[20px] fixed  h-full md:h-3/4 ">
            {/* nav */}
            <nav className="border-b-[3px] border-[#E4E4E4]">
              <div className="p-4 flex flex-row justify-between ">
                <div className="flex  text-[#5DCFFF] text-[20px]  font-normal">
                  <span className="mr-2 self-center h-2 w-2 shadow-lg   rounded-full  bg-green-400 "></span>
                  <p>Ulayaw</p>
                </div>
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
                          <img src="ulayaw.png" />
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
            {showChatBox ? (
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
                    <img src="ulayaw.png" />
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
        {/* <DisplayBot talkInput={talkInput} messagesEnd={messagesEnd} /> */}
      </div>
      <div className="z-0 ">{showThoughtDiaryTool ? <ThoughtDiary /> : ""}</div>
      {showUTS ? (
        <UTS _handleUTSClick={_handleUTSClick} getUTSBool={getUTSBool} />
      ) : (
        ""
      )}
    </div>
  );
}

function ModalTermsAndConditions({ showModal, setShowModal }) {
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

function ThoughtDiary() {
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
  let firstHit = -1;
  let firstHitOther = -1;

  function _handleMoodResultGetHotEmotionCAnswer(item, i) {
    // console.log(item, i, getHotEmotionCAnswer.length - 1, "test");

    if (item.select) {
      return item.mood_text;
    }
  }
  const [basket, setBasket] = useState([]);
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
    <div className="left-0 top-0 w-[full] h-screen bg-[#3D829F] bg-opacity-[0.60] z-20">
      <div className=" left-0 w-[1350px] pl-[24px] pt-[26px] h-full  ">
        {/* header */}
        <div className=" w-[215px] h-[54px] rounded-t-[15px] ml-2 text-[20px] lg:text-[24px] p-[18px] lg:pt-[11px] px-[23px] text-white self-center bg-[#49c3f7] font-bold">
          <p>Thought Diary</p>
        </div>

        {/* body */}
        {/* bg-black bg-opacity-[0.75] text-opacity-0  */}
        <div
          className={
            focusThoughtDiaryLetter != null
              ? "bg-[#5DCFFF] w-full rounded-[15px]  self-center grid grid-cols-4  h-[750px]  text-white font-semibold "
              : "w-full rounded-[15px]  self-center grid grid-cols-4  h-[750px] text-[#4CC2F4] text-[20px] font-semibold bg-white"
          }
        >
          {/* A and C */}
          <div className="grid grid-rows-2">
            {/* section 1 */}
            <div
              className={
                focusThoughtDiaryLetter === "a" ||
                focusThoughtDiaryLetter === "a_b"
                  ? "border-b-4 border-[#86A1AC] bg-white text-[#4CC2F4]"
                  : "border-b-4 border-[#86A1AC]"
              }
            >
              <div className=" p-4 break-words max-w-[300px]">
                <label className="text-[20px] ">A) Activating Event</label>
                <div className="flex flex-col leading-none  text-[32px] text-center pt-4">
                  <label className="text-[14px] text-blue-900  font-bold">
                    something happens to you or in the environment around you.
                    <br />
                    <label className="font-normal">
                      (What happened? What did I do? What did others do? What
                      idea occurred to me? What’s stressing me out?)
                    </label>
                  </label>
                  <label className="">
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
                  ? " bg-white p-4 text-[#4CC2F4]"
                  : " p-4"
              }
            >
              <label className="text-[20px] ">C) Consequences</label>
              <div className=" text-center break-words max-w-[300px]">
                {/* Hot emotion section */}
                <label className="flex flex-col leading-none">
                  <label className="text-[14px] text-blue-900  font-bold">
                    hot emotion: rated {getHotEmotionRate}/10
                  </label>
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
                  <label className="text-[14px] text-blue-900  font-bold">
                    other emotions you feel
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
          <div className="border-l-4 border-[#86A1AC] grid grid-rows-2 ">
            {/* section 1 */}
            <div
              className={
                focusThoughtDiaryLetter === "b" ||
                focusThoughtDiaryLetter === "b_c" ||
                focusThoughtDiaryLetter === "a_b"
                  ? "pb-4 bg-white p-4 text-[#4CC2F4]"
                  : "pb-4 p-4"
              }
            >
              <label className="text-[20px] ">B) Beliefs</label>
              <div className="text-center break-words max-w-[290px]">
                {/* hot thought */}
                <label className="flex flex-col leading-none">
                  <label className="text-[14px] text-blue-900  font-bold">
                    the hot thought: rated {getHotThoughtRate}/100
                  </label>
                  <label className="">
                    {getHotThoughtB}
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
                      {getOtherThoughtB != null || getOtherThoughtB != undefined
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
                      {/* <label className="">
                      This isn't going to work
                      <span className="text-[50px] leading-[0px]">,</span>
                    </label>
                    <label className="">
                      I'm not good at anything
                      <span className="text-[50px] leading-[0px]">,</span>
                    </label>
                    <label className="">
                      Coming to other people is pointless
                      <span className="text-[50px] leading-[0px]">,</span>
                    </label>
                    <label className="">
                      I feel worthless
                      <span className="text-[50px] leading-[0px]">,</span>
                    </label>
                    <label className="">
                      I don't belong here
                      <span className="text-[50px] leading-[0px]">.</span>
                    </label> */}
                    </label>
                  </div>
                </label>
              </div>
            </div>
            {/* section 2 */}
            <div
              className={
                focusThoughtDiaryLetter === "b_uts"
                  ? "pt-11 text-center break-words max-w-[330px] pb-4 bg-white p-4 text-[#4CC2F4]"
                  : "pt-11 text-center break-words max-w-[330px] pb-4 p-4"
              }
            >
              {/* The hot thought Unhelpful Thinking Styles */}
              <label className="flex flex-col leading-none">
                <label className="text-[14px] text-blue-900  font-bold">
                  the hot thought unhelpful thinking style
                </label>
                <label className="">
                  {/* Jumping to Conclusions
                    <span className="text-[50px] leading-[0px]">.</span> */}
                  {/* {getUTSContainer != null ||
                  getUTSContainer != undefined ||
                  getUTSContainer.length != 0
                    ? getUTSContainer.map((item, i) => {
                        console.log(getUTSContainer);
                        // console.log(firstHit === -1, firstHit);
                        // if (item.select && firstHit === -1) {
                        //   firstHit = i;
                        // }
                        return (
                          <>
                            {i != 0 ? (
                              <span className="text-[50px] leading-[0px]">
                                ,
                              </span>
                            ) : (
                              ""
                            )}
                            {item.title}
                            <span className=" leading-[0px] px-2">{">"}</span>
                            {item.thought}
                          </>
                        );
                      })
                    : ""} */}

                  {/* {getUTSContainer.length === 0 ? (
                    <>
                      {getUTSContainer[0].item.title}
                      <span className=" leading-[0px] px-2">{">"}</span>
                      {getUTSContainer[0].item.thought}
                    </>
                  ) : (
                    ""
                  )} */}
                  <span className="text-[50px] leading-[0px]">.</span>
                </label>
              </label>

              {/* Other Unhelpful Thinking Styles  */}
              <label className="flex flex-col leading-none pt-10">
                <label className="text-[14px] text-blue-900  font-bold">
                  other mentioned unhelpful thinking styles
                </label>
                {/* other thoughts instances */}
                <div className="leading-none flex flex-col">
                  {/* <label className="">
                      (2) Black & White Thinking
                      <span className="text-[50px] leading-[0px]">,</span>
                    </label>

                    <label className="">
                      Overgeneralisation
                      <span className="text-[50px] leading-[0px]">.</span>
                    </label> */}
                </div>
              </label>
            </div>
          </div>
          {/* D */}
          <div className="border-l-4 border-[#86A1AC] grid grid-rows-2">
            {/* section 1 */}
            <div className="pb-4 p-4">
              <label className="text-[18px] text-[#4CC2F4]">
                D) Detective Work & Disputation
              </label>
              {/* for evidence */}
              <div className="text-center break-words max-w-[330px]">
                <label className="flex flex-col leading-none">
                  <label className="text-[14px] text-blue-900  font-bold">
                    for evidence
                  </label>

                  <div className="leading-none flex flex-col">
                    {/* <label className="pb-4">
                      {" "}
                      I've been depressed for three years
                      <span className="text-[50px] leading-[0px]">,</span>
                    </label>
                    <label className="pb-4">
                      I haven't seen much change
                      <span className="text-[50px] leading-[0px]">,</span>
                    </label>
                    <label className="pb-4">
                      I'm always gonne be this way
                      <span className="text-[50px] leading-[0px]">,</span>
                    </label> */}
                  </div>
                </label>
              </div>
            </div>
            {/* section 2 */}
            <div className="pb-4 p-4 text-center break-words max-w-[330px]">
              {/* against evidence */}
              <label className="flex flex-col leading-none">
                <label className="text-[14px] text-blue-900  font-bold">
                  against evidence
                </label>

                <div className="leading-none flex flex-col ">
                  {/* <label className="pb-4">
                      {" "}
                      Sometimes I feel ok
                      <span className="text-[50px] leading-[0px]">,</span>
                    </label>
                    <label className="pb-4">
                      I have some good days here and there
                      <span className="text-[50px] leading-[0px]">,</span>
                    </label>
                    <label className="pb-4">
                      Before this week I'd been having a few more good days
                      <span className="text-[50px] leading-[0px]">,</span>
                    </label>
                    <label className="pb-4">
                      I wasn't depressed when I was in europe
                      <span className="text-[50px] leading-[0px]">,</span>
                    </label>
                    <label className="pb-4">
                      My depression went away before
                      <span className="text-[50px] leading-[0px]">,</span>
                    </label>
                    <label className="pb-4">
                      I have some friends who recover from depression{" "}
                      <span className="text-[50px] leading-[0px]">.</span>
                    </label> */}
                </div>
              </label>
            </div>
          </div>
          <div className="border-l-4 border-[#86A1AC] p-4">
            <label className="text-[20px] text-[#4CC2F4]">E) End Result</label>
          </div>
        </div>
      </div>
    </div>
  );
}
export default withRouter(Chatbot);
