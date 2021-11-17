import React, { useState, useEffect, useRef, useContext } from "react";
import UTSData from "../data/uts.json";
import { GetUTSContext } from "../Context/GetUTSContext";
import { MaxInputContext } from "../Context/MaxInputContext";

export default function UTS(props) {
  const [isHovering, setIsHovering] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [disputationTitle, setDisputationTitle] = useState("");
  const [disputationQ, setDisputationQ] = useState("");
  const { getUTS, setGetUTS } = useContext(GetUTSContext);
  const { maxInput, setMaxInput } = useContext(MaxInputContext);

  const onMouseEnter = () => {
    setIsHovering(true);
  };

  const onMouseLeave = () => {
    setIsHovering(false);
  };

  const HoverText = () => {
    return (
      <div
        className={
          title === "Unhelpful Thinking Styles"
            ? "fixed left-0 bottom-[50px] h-[400px]  w-[1350px]  "
            : "fixed left-0 bottom-[100px] h-[300px]  w-[1350px]  "
        }
      >
        <div className="h-full flex flex-col w-full pl-[24px]">
          {/* header */}
          <div className="w-full rounded-t-[10px] text-[20px]  p-[10px]  text-white text-center self-center bg-[#5DCFFF] font-semibold shadow-lg border-t-2 border-r-2 border-l-2">
            <p>{title} Description</p>
          </div>
          {/* body */}
          <div className="w-full h-[400px] rounded-b-[10px] text-[16px]  p-[40px] px-[200px]  self-center bg-white  grid shadow-lg">
            <p className="text-justify ">{description}</p>
            {title != "Unhelpful Thinking Styles" ? (
              <div className="space-y-0 ">
                <p className="text-left text-[20px] ">Disputation Questions</p>
                <p className="text-left pl-12">
                  <p className="">{disputationTitle}</p>
                  {disputationQ.map((item, i) => {
                    if (i != 0) {
                      return (
                        <p className=" pl-12">
                          {" - "}
                          {item}
                        </p>
                      );
                    }
                  })}
                </p>
              </div>
            ) : (
              ""
            )}
          </div>

          {/* {UTSList()} */}
        </div>
      </div>
    );
  };

  // function UTSList() {
  //   return <div>{console.log(UTSData.UTS_Description)}</div>;
  //   // UTSData.map(())
  // }

  return (
    <div className="left-0 bottom-0 fixed  w-[1350px] ">
      <div className="h-full flex flex-col w-full pl-[24px]">
        {/* body */}
        <div className="w-full h-[50px] border-t-2 rounded-t-[10px] text-[14px]  p-[18px] px-[10px]  self-center bg-white bg-opacity-[0.80]  shadow-lg grid grid-cols-6 text-center select-none">
          {UTSData.Types.map((item, i) => {
            if (i <= 5) {
              return (
                <p
                  onMouseEnter={() => {
                    setTitle(item.title);
                    setDescription(item.Description);
                    setDisputationTitle(item.DisputationQ[0]);
                    setDisputationQ(item.DisputationQ);
                    onMouseEnter();
                  }}
                  onMouseLeave={() => {
                    setTitle("");
                    setDescription("");
                    setDisputationTitle("");
                    setDisputationQ("");
                    // setGetUTS("");
                    onMouseLeave();
                  }}
                  onClick={() => {
                    if (props.getUTSBool) {
                      props._handleUTSClick(item.title);
                      setGetUTS(item.title);
                      // props.df_text_query(item.title, false, "bot");
                    }
                    // console.log(cookies.get("getUTS"));
                    console.log(getUTS);
                  }}
                  className=" cursor-pointer hover:bg-gray hover:border-2 rounded-lg text-blue-900 font-semibold"
                >
                  {item.title}
                </p>
              );
            }
          })}
        </div>
        {/* header */}
        <div className="w-full rounded-b-[10px] text-[14px] h-[50px] p-[10px]  text-white text-center self-center bg-[#5DCFFF] font-semibold shadow-lg grid grid-cols-5 select-none">
          {UTSData.Types.map((item, i) => {
            if (i === 8) {
              return (
                <div className="col-span-2 grid grid-cols-2">
                  <p
                    onMouseEnter={() => {
                      setTitle("Unhelpful Thinking Styles");
                      setDescription(UTSData.UTS_Description);
                      onMouseEnter();
                    }}
                    onMouseLeave={() => {
                      setTitle("");
                      setDescription("");
                      onMouseLeave();
                    }}
                    className="text-[18px] cursor-pointer hover:bg-gray hover:border-2 rounded-lg"
                  >
                    Unhelpful Thinking Styles{" "}
                  </p>
                  <p
                    onMouseEnter={() => {
                      setTitle(item.title);
                      setDescription(item.Description);
                      setDisputationTitle(item.DisputationQ[0]);
                      setDisputationQ(item.DisputationQ);
                      onMouseEnter();
                    }}
                    onMouseLeave={() => {
                      setTitle("");
                      setDescription("");
                      setDisputationTitle("");
                      setDisputationQ("");
                      // setGetUTS("");
                      onMouseLeave();
                    }}
                    onClick={(e) => {
                      if (props.getUTSBool) {
                        props._handleUTSClick(item.title);
                        setGetUTS(item.title);
                      }
                      console.log(getUTS);
                    }}
                    className="cursor-pointer hover:bg-gray hover:border-2 rounded-lg"
                  >
                    {item.title}
                  </p>
                </div>
              );
            }
            if (i >= 6) {
              return (
                <p
                  onMouseEnter={() => {
                    setTitle(item.title);
                    setDescription(item.Description);
                    setDisputationTitle(item.DisputationQ[0]);
                    setDisputationQ(item.DisputationQ);
                    onMouseEnter();
                  }}
                  onMouseLeave={() => {
                    setTitle("");
                    setDescription("");
                    setDisputationTitle("");
                    setDisputationQ("");
                    // setGetUTS("");
                    onMouseLeave();
                  }}
                  onClick={(e) => {
                    if (props.getUTSBool) {
                      props._handleUTSClick(item.title);
                      setGetUTS(item.title);
                      console.log(getUTS);
                    }
                  }}
                  className=" cursor-pointer hover:bg-gray hover:border-2 rounded-lg"
                >
                  {item.title}
                </p>
              );
            }
          })}
        </div>
        {isHovering && HoverText()}
      </div>
    </div>
  );
}
