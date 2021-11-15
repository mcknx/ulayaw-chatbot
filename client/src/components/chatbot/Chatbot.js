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

  // Step 1: Start by getting the mood
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [getMoodStep1, setGetMoodStep1] = useState(false);
  const [getMoodWhenStartedStep1, setGetMoodWhenStartedStep1] = useState("");
  const { focusThoughtDiaryLetter, setFocusThoughtDiaryLetter } = useContext(
    ThoughtDiaryFocusContext
  );
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
  const [getHotThoughtBool, setGetHotThoughtBool] = useState(false);
  const [getOtherThoughtBool, setGetOtherThoughtBool] = useState(false);
  const { getHotThoughtB, setGetHotThoughtB } = useContext(
    GetHotThoughtBContext
  );
  const { getOtherThoughtB, setGetOtherThoughtB } = useContext(
    GetOtherThoughtBContext
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

    // if (window.location.pathname === "/" && !welcomeSent) {
    //   await resolveAfterXSeconds(1);
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
                  `Okay, that wasn't so strong. However, you mentioned experiencing these things that affected you.'${_handleMoods(
                    getHotEmotionCAnswer
                  )}' and
                '${_handleShowList(getOtherEmotionAll)}'`,
                  false,
                  "bot"
                );
              }
              if (chat > 5 && chat <= 10) {
                df_text_query(chat, false);
                df_text_query(
                  `Okay, that's pretty strong. It's not surprising that you've noticed that these things affected you. '${_handleMoods(
                    getHotEmotionCAnswer
                  )}' and
                  '${_handleShowList(getOtherEmotionAll)}'`,
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
              df_event_query("ABC_THOUGHT_DIARY_B");
              setGetRateEmotion(false);
              setGetAfterFeelings(false);
              setGetOtherThoughtBool(true);
              setShowChatBox(true);
              setGetHotEmotionRate(chat);
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
          setGetOtherThoughtB();
          df_text_query(chat, false);
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
      df_text_query(_handleMoods(getOtherEmotionCAnswer), false);
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

    if (type === "after_feelings") {
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
      message.msg.payload.fields.explaining_b
    ) {
      return (
        <>
          {/* {console.log(getRateEmotion, "waw sadsad")} */}

          {renderOneMessageStatic(
            `Okay, so what was on your mind if we could go back '${getMoodWhenStartedStep1}' to the time and place when you said: '${getAdverseStep3}'. `
          )}
          {renderOneMessageStatic(`Answer the question "What was going through my head at the time? 
                
                Try to put it in a lesser sentence so that we can fit it here in the thought diary. `)}
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
      // if (i != 0) {
      //   res += ",";
      // }
      res += item;
      return res;
    });
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
  let firstHit = -1;
  let firstHitOther = -1;

  function _handleMoodResultGetHotEmotionCAnswer(item, i) {
    // console.log(item, i, getHotEmotionCAnswer.length - 1, "test");

    if (item.select) {
      return item.mood_text;
    }
  }
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
      // if (i != 0) {
      //   res += ",";
      // }
      res += item;
      return res;
    });
  }
  return (
    <div className="left-0 top-0 w-[full] h-screen bg-[#3D829F] bg-opacity-[0.60] z-20">
      <div className=" left-0 w-[1780px] pl-[24px] pt-[26px] h-full  ">
        {/* header */}
        <div className=" w-[215px] h-[54px] rounded-t-[15px] ml-2 text-[20px] lg:text-[24px] p-[18px] lg:pt-[11px] px-[23px] text-white self-center bg-[#5DCFFF] font-bold">
          <p>Thought Diary</p>
        </div>

        {/* body */}
        {/* bg-black bg-opacity-[0.75] text-opacity-0  */}
        <div
          className={
            focusThoughtDiaryLetter != null
              ? "bg-[#5DCFFF] w-3/4 rounded-[15px]  self-center grid grid-cols-4  h-[750px]  text-white font-semibold "
              : "w-3/4 rounded-[15px]  self-center grid grid-cols-4  h-[750px] text-[#4CC2F4] text-[20px] font-semibold bg-white"
          }
        >
          {/* A and C */}
          <div className="grid grid-rows-2">
            {/* section 1 */}
            <div
              className={
                focusThoughtDiaryLetter === "a"
                  ? "border-b-4 border-[#86A1AC] bg-white text-[#4CC2F4]"
                  : "border-b-4 border-[#86A1AC]"
              }
            >
              <div className=" p-4 break-words max-w-[300px]">
                <label className="text-[20px] ">A)</label>
                <div className="flex flex-col leading-none  text-[32px] text-center pt-4">
                  <label className="text-[14px] text-[#BF2C53]  font-bold">
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
                focusThoughtDiaryLetter === "c"
                  ? " bg-white p-4 text-[#4CC2F4]"
                  : " p-4"
              }
            >
              <label className="text-[20px] ">C)</label>
              <div className=" text-center break-words max-w-[300px]">
                {/* Hot emotion section */}
                <label className="flex flex-col leading-none">
                  <label className="text-[14px] text-[#BF2C53]  font-bold">
                    hot emotion: rated {getHotEmotionRate}/10
                  </label>
                  <label className="text-[#4CC2F4]">
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
                  <label className="text-[#4CC2F4]">
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
            <div className="pb-4 p-4  ">
              <label className="text-[20px] text-[#4CC2F4]">B)</label>
              <div className="text-center break-words max-w-[330px]">
                {/* hot thought */}
                <label className="flex flex-col leading-none">
                  <label className="text-[14px] text-[#BF2C53]  font-bold">
                    the hot thought
                  </label>
                  <label className="">
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
                  <div className="leading-normal flex flex-col">
                    {/* {_handleShowList(getOtherThoughtB[0])} */}
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
                  </div>
                </label>
              </div>
            </div>
            {/* section 2 */}
            <div className="pt-11 p-4 text-center break-words max-w-[330px]">
              {/* The hot thought Unhelpful Thinking Styles */}
              <label className="flex flex-col leading-none">
                <label className="text-[14px] text-[#BF2C53]  font-bold">
                  the hot thought unhelpful thinking style
                </label>
                <label className="">
                  {/* Jumping to Conclusions
                    <span className="text-[50px] leading-[0px]">.</span> */}
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
              <label className="text-[20px] text-[#4CC2F4]">D)</label>
              {/* for evidence */}
              <div className="text-center break-words max-w-[330px]">
                <label className="flex flex-col leading-none">
                  <label className="text-[14px] text-[#BF2C53]  font-bold">
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
                <label className="text-[14px] text-[#BF2C53]  font-bold">
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
            <label className="text-[20px] text-[#4CC2F4]">E)</label>
          </div>
        </div>
      </div>
    </div>
  );
}
export default withRouter(Chatbot);
