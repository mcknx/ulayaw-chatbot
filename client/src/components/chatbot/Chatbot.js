import React, { useState, useEffect, useRef } from "react";
import axios from "axios/index";
import Message from "./Message";
import Card from "./Card";
import Cookies from "universal-cookie";
import { v4 as uuid } from "uuid";
import QuickReplies from "./QuickReplies";
import { withRouter } from "react-router-dom";
import "../../styles/chatbot.css";

const cookies = new Cookies();

function Chatbot(props) {
  const [messages, setMessages] = useState([]);
  const [showBot, setShowBot] = useState(false);
  const [shopWelcomeSent, setShopWelcomeSent] = useState(false);
  const [welcomeSent, setWelcomeSent] = useState(false);
  const [showModal, setShowModal] = useState(true);

  let messagesEnd = useRef(null);
  let talkInput = useRef(null);

  if (cookies.get("userID") === undefined) {
    cookies.set("userID", uuid(), { path: "/" });
  }
  // console.log(cookies.get("userID"));

  async function df_text_query(queryText) {
    let says = {
      speaks: "user",
      msg: {
        text: {
          text: queryText,
        },
      },
    };
    // setMessages({ messages: [...messages, says] });

    // Version 2
    // setMessages([...messages, says]);

    setMessages((prevMessages) => {
      return [...prevMessages, says];
    });

    // const res = await axios.post("/api/df_text_query", { text: queryText });
    const res = await axios.post("/api/df_text_query", {
      text: queryText,
      userID: cookies.get("userID"),
    });

    for (let msg of res.data.fulfillmentMessages) {
      says = {
        speaks: "bot",
        msg: msg,
      };
      // Version 1
      // setMessages({ messages: [...messages, says] });

      // Version 2
      // setMessages([...messages, says]);

      setMessages((prevMessages) => {
        return [...prevMessages, says];
      });
    }
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

    if (window.location.pathname === "/about" && !shopWelcomeSent) {
      await resolveAfterXSeconds(1);
      df_event_query("WELCOME_SHOP");
      setShowBot(true);
      setShopWelcomeSent(true);
    }

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

  function _handleQuickReplyPayload(event, payload, text) {
    event.preventDefault();
    event.stopPropagation();

    switch (payload) {
      case "recommended_yes":
        df_event_query("SHOW_RECOMMENDATIONS");
        break;
      case "training_masterclass":
        df_event_query("MASTERCLASS");
      default:
        df_text_query(text);
        break;
    }
  }

  function renderCards(cards) {
    return cards.map((card, i) => <Card key={i} payload={card.structValue} />);
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
      );
    }
  }

  function renderMessages(returnedMessages) {
    if (returnedMessages) {
      // console.log(returnedMessages);

      return returnedMessages.map((message, i) => {
        console.log(i);
        return renderOneMessage(message, i);
      });
    } else {
      return null;
    }
  }
  function _handleInputKeyPress(e) {
    if (e.key === "Enter") {
      df_text_query(e.target.value);
      e.target.value = "";
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
      {showBot ? (
        <div className="flex flex-col  md:w-96  shadow-lg w-full border-2  bottom-0 bg-white right-0 md:bottom-5   md:right-5  rounded-[20px] fixed  h-full md:h-3/4 ">
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
            <div className=" p-2 ">{renderMessages(messages)}</div>
            <div
              ref={(el) => {
                messagesEnd = el;
              }}
              className="clear-both"
              // style={{ float: "left", clear: "both" }}
            ></div>
          </div>
          {/* input */}
          <label className="  border-[#E4E4E4]  w-full md:w-96  flex flex-row border-t-2 rounded-b-[20px] ">
            <input
              className=" focus:ring-1 focus:ring-[#5DCFFF] p-4 outline-none w-full rounded-b-[20px]"
              type="text"
              onKeyPress={_handleInputKeyPress}
              placeholder="Iyong Mensahe ..."
              ref={(input) => {
                talkInput = input;
              }}
            />
            <button className="absolute p-4 transform hover:scale-[1.1] right-0">
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
            <label className=" space-x-[10px]  text-[#5DCFFF] inline-block p-4 hover:bg-gray-200 rounded-lg cursor-pointer select-none w-full">
              <input
                className="self-center"
                name="agreed"
                type="checkbox"
                // checked={}
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

export default withRouter(Chatbot);
