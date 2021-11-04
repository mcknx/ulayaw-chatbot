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

const cookies = new Cookies();

function Chatbot(props) {
  const [messages, setMessages] = useState([]);
  const [showBot, setShowBot] = useState(true);
  const [shopWelcomeSent, setShopWelcomeSent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [claimCode, setClaimCode] = useState(false);
  const [correctCode, setCorrectCode] = useState(false);
  const [assessmentScore, setAssessmentScore] = useState();

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

  let messagesEnd = useRef(null);
  let talkInput = useRef(null);

  if (cookies.get("userID") === undefined) {
    cookies.set("userID", uuid(), { path: "/" });
  }

  async function df_text_query(queryText) {
    let says = {
      speaks: "user",
      msg: {
        text: {
          text: queryText,
        },
      },
    };

    setMessages((prevMessages) => {
      return [...prevMessages, says];
    });

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
        // console.log(getAdverseStep3);
      } else {
        if (e.target.value !== "") df_text_query(e.target.value);
      }

      e.target.value = "";
    }
  }

  function _handleShowThoughtDiary() {
    console.log(showThoughtDiaryTool);
    return renderOneMessageStatic("THOUGHT DIARY");
  }

  function _handleQuickReplyPayload(event, payload, text) {
    event.preventDefault();
    event.stopPropagation();

    if (payload === "long time ago" || payload === "recently") {
      setGetMoodWhenStartedStep1(payload);
      // console.log(getMoodWhenStartedStep1);
      return df_event_query("ABC_THOUGHT_DIARY_NOT_INTRO");
    }

    console.log(payload);

    switch (payload) {
      case "recommended_yes":
        df_event_query("SHOW_RECOMMENDATIONS");
        break;
      case "training_masterclass":
        df_event_query("MASTERCLASS");
        break;
      case "training_demographics-continue":
        df_event_query("ABC_GETMOOD");
        break;
      case "abc_continue_step_1":
        df_event_query("ABC_GETMOOD");
        break;
      case "show_thought_diary":
        df_event_query("ABC_THOUGHT_DIARY_EXPLAINING_A");
        break;

      // case "exit_ulayaw":
      // df_event_query("ABC_GETMOOD");

      // case "training_assessment-continue":
      //   df_event_query("ULAYAW_ASSESSMENT");

      // renderOneMessageStatic("code");
      // console.log("training_assessment captured");
      // setClaimCode(true);
      // break;
      // break;
      default:
        df_text_query(text);
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
    setGetMoodStep1(true);
    // df_event_query("ASSESSMENT_DONE");
    // setClaimCode(false);
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
        <MultipleChoice
          key={i}
          _handleAssessmentResult={_handleAssessmentResult}
          speaks={message.speaks}
          payload={message.msg.payload.fields.multiple_choice.listValue.values}
          setAssessmentScore={setAssessmentScore}
          assessmentScore={assessmentScore}
        />
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
        <GetMoods
          key={i}
          _handleMoodResult={_handleMoodResult}
          speaks={message.speaks}
          payload={message.msg.payload.fields.get_mood.listValue.values}
          selectedMoods={selectedMoods}
          setSelectedMoods={setSelectedMoods}
          // setAssessmentScore={setAssessmentScore}
          // assessmentScore={assessmentScore}
        />
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
          {/* {renderOneMessageStatic(
            "Do you have any ideas when these mood(s) first appeared?"
          )} */}
          {renderOneMessageStatic(
            message.msg.payload.fields.mood_assess_text.stringValue
          )}

          <QuickReplies
            text={
              message.msg.payload.fields.text
                ? message.msg.payload.fields.text
                : null
            }
            key={i}
            replyClick={_handleQuickReplyPayload}
            onChange={() => setShowThoughtDiaryTool(true)}
            speaks={message.speaks}
            payload={message.msg.payload.fields.mood_assess.listValue.values}
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
                  onClick={() => setShowThoughtDiaryTool(true)}
                  className="bg-[#F2EFEF] rounded-full  p-2 px-4 self-center h-10 cursor-pointer"
                >
                  Show Thought Diary
                </a>
              </span>
            </div>
          </div>

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
      message.msg.payload.fields.explaining_A_question_1
    ) {
      return (
        <>
          {renderOneMessageStatic(
            `So, when you mention '${getMoodWhenStartedStep1}' what time and place do you think you first noticed the change in your mood? Answer this question: Was it yesterday? last week? last month? last year? last decade? When did it occur? at school? at work? at home? while playing? while working? Try to put it in a lesser sentence so that we can fit it here in the thought diary.`
          )}
          {activateGetAdverseStep3 === 0 ? setActivateGetAdverseStep3(1) : ""}

          {activateGetAdverseStep3 === 2
            ? renderOneMessageStatic(
                `
            Okay I got your answer here.'${getAdverseStep3UseState}' `
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
                      df_event_query("ABC_THOUGHT_DIARY_EXPLAINING_C");
                      setGetAdverseStep3(getAdverseStep3UseState);
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
            `So you mentioned earlier about your present mood(s): '${_handleHotMood()}' 
            Is it still the ones you feel when we go back to the time after you said this: '${getAdverseStep3}' or is your mood different back then? If yes can you identify it again for me?`
          )}

          <GetMoods
            key={i}
            _handleMoodResult={_handleMoodResult}
            speaks={message.speaks}
            payload={message.msg.payload.fields.get_mood_hot.listValue.values}
            selectedMoods={selectedMoods}
            setSelectedMoods={setSelectedMoods}
            // setAssessmentScore={setAssessmentScore}
            // assessmentScore={assessmentScore}
          />
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

  function _handleHotMood() {
    let res = "";
    for (let i = 0; i < selectedMoods.length; i++) {
      if (i === selectedMoods.length - 1) {
        res += selectedMoods[i].mood_text + ".";
      } else {
        res += selectedMoods[i].mood_text + ",";
      }
    }
    return res;
  }

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
  return (
    <div className="left-0 top-0 w-[full] h-screen bg-[#3D829F] bg-opacity-[0.60] z-20">
      <div className=" left-0 w-[1780px] pl-[24px] pt-[26px] h-full  ">
        {/* header */}
        <div className=" w-[215px] h-[54px] rounded-t-[15px] ml-2 text-[20px] lg:text-[24px] p-[18px] lg:pt-[11px] px-[23px] text-white self-center bg-[#5DCFFF] font-bold">
          <p>Thought Diary</p>
        </div>

        {/* body */}
        <div className="w-3/4 rounded-[15px]  self-center bg-white grid grid-cols-4  h-[750px] text-[#4CC2F4] text-[20px] font-semibold">
          {/* A and C */}
          <div className="grid grid-rows-2">
            {/* section 1 */}
            <div className="border-b-4 border-[#86A1AC] p-4">
              <label className="text-[20px]">A)</label>
              <div className="flex flex-col leading-none  text-[32px] text-center pt-4">
                <label className="text-[14px] text-[#BF2C53] opacity-75 font-bold">
                  an actual event or situation, a thought, the cause, mental
                  picture or physical trigger.
                </label>
                <label>
                  {/* Crying out loud last week */}
                  {getAdverseStep3}
                </label>
              </div>
            </div>
            {/* section 2 */}
            <div className="p-4">
              <label className="text-[20px]">C)</label>
              <div className=" text-center">
                {/* Hot emotion section */}
                <label className="flex flex-col leading-none">
                  <label className="text-[14px] text-[#BF2C53] opacity-75 font-bold">
                    hot emotion: rated 7/10
                  </label>
                  <label className="">
                    Sad<span className="text-[50px] leading-[0px]">,</span> Low
                    feeling<span className="text-[50px] leading-[0px]">.</span>
                  </label>
                </label>

                {/* Other emotions section */}
                <label className="pt-10 flex flex-col leading-none">
                  <label className="text-[14px] text-blue-900 opacity-75 font-bold">
                    other emotions you feel
                  </label>
                  <label className="">
                    Heavy<span className="text-[50px] leading-[0px]">,</span>{" "}
                    Low Energy
                    <span className="text-[50px] leading-[0px]">,</span> Tired
                    <span className="text-[50px] leading-[0px]">.</span>
                  </label>
                </label>
              </div>
            </div>
          </div>
          {/* B */}
          <div className="border-l-4 border-[#86A1AC]">
            <div className=" grid grid-rows-2 ">
              {/* section 1 */}
              <div className="pb-4 p-4">
                <label className="text-[20px]">B)</label>
                {/* hot thought */}
                <label className="flex flex-col leading-none">
                  <label className="text-[14px] text-[#BF2C53] opacity-75 font-bold">
                    the hot thought
                  </label>
                  <label className="">
                    I'm always going to feel depressed
                    <span className="text-[50px] leading-[0px]">.</span>
                  </label>
                </label>

                {/* other thoughts */}
                <label className="flex flex-col leading-none pt-10">
                  <label className="text-[14px] text-blue-900 opacity-75 font-bold">
                    other thoughts
                  </label>
                  {/* other thoughts instances */}
                  <div className="leading-normal flex flex-col">
                    <label className="">
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
                    </label>
                  </div>
                </label>
              </div>
              {/* section 2 */}
              <div className="pt-11 p-4">
                {/* The hot thought Unhelpful Thinking Styles */}
                <label className="flex flex-col leading-none">
                  <label className="text-[14px] text-[#BF2C53] opacity-75 font-bold">
                    the hot thought unhelpful thinking style
                  </label>
                  <label className="">
                    Jumping to Conclusions
                    <span className="text-[50px] leading-[0px]">.</span>
                  </label>
                </label>

                {/* Other Unhelpful Thinking Styles  */}
                <label className="flex flex-col leading-none pt-10">
                  <label className="text-[14px] text-blue-900 opacity-75 font-bold">
                    other mentioned unhelpful thinking styles
                  </label>
                  {/* other thoughts instances */}
                  <div className="leading-none flex flex-col">
                    <label className="">
                      (2) Black & White Thinking
                      <span className="text-[50px] leading-[0px]">,</span>
                    </label>

                    <label className="">
                      Overgeneralisation
                      <span className="text-[50px] leading-[0px]">.</span>
                    </label>
                  </div>
                </label>
              </div>
            </div>
          </div>
          {/* D */}
          <div className="border-l-4 border-[#86A1AC] ">
            <div className="grid grid-rows-2">
              {/* section 1 */}
              <div className="pb-4 p-4">
                <label className="text-[20px]">D)</label>
                {/* for evidence */}
                <label className="flex flex-col leading-none">
                  <label className="text-[14px] text-[#BF2C53] opacity-75 font-bold">
                    for evidence
                  </label>

                  <div className="leading-none flex flex-col">
                    <label className="pb-4">
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
                    </label>
                  </div>
                </label>
              </div>
              {/* section 2 */}
              <div className="pb-4 p-4">
                {/* against evidence */}
                <label className="flex flex-col leading-none">
                  <label className="text-[14px] text-[#BF2C53] opacity-75 font-bold">
                    against evidence
                  </label>

                  <div className="leading-none flex flex-col ">
                    <label className="pb-4">
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
                    </label>
                  </div>
                </label>
              </div>
            </div>
          </div>
          <div className="border-l-4 border-[#86A1AC] p-4">
            <label className="text-[20px]">E)</label>
          </div>
        </div>
      </div>
    </div>
  );
}
export default withRouter(Chatbot);
