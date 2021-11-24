import React, { useState, useContext } from "react";
import { MaxInputContext } from "../../../Context/MaxInputContext.js";
import { GetOtherEmotionCAnswerContext } from "../../../Context/GetOtherEmotionCAnswerContext.js";
import { GetOtherEmotionAllContext } from "../../../Context/GetOtherEmotionAllContext.js";

const Mood = (props) => {
  const { maxInput, setMaxInput } = useContext(MaxInputContext);
  const { getOtherEmotionCAnswer, setGetOtherEmotionCAnswer } = useContext(
    GetOtherEmotionCAnswerContext
  );
  const { getOtherEmotionAll, setGetOtherEmotionAll } = useContext(
    GetOtherEmotionAllContext
  );
  function _handleCheck(event) {
    let res = false;
    if (props.selectedMoods.length < 1) {
      return true;
    }
    for (let i = 0; i < props.selectedMoods.length; i++) {
      if (props.selectedMoods[i].mood_text === event.target.value) {
        res = true;
      }
    }
    return res;
  }

  function _handleMoodImg(mood) {
    if (mood === "low") {
      return "low.png";
    }
    if (mood === "sad") {
      return "sad.png";
    }
    if (mood === "annoyed") {
      return "annoyed.png";
    }
    if (mood === "disappointed") {
      return "disappointed.png";
    }
    if (mood === "empty") {
      return "empty.png";
    }
    if (mood === "overwhelmed") {
      return "overwhelmed.png";
    }
    if (mood === "worried") {
      return "worried.png";
    }
    if (mood === "frustrated") {
      return "frustrated.png";
    }
    if (mood === "guilty") {
      return "guilty.png";
    }
    if (mood === "hopeless") {
      return "hopeless.png";
    }
    if (mood === "lonely") {
      return "lonely.png";
    }
    if (mood === "nervous") {
      return "nervous.png";
    }
    if (mood === "stressed") {
      return "stressed.png";
    }
    if (mood === "heavy") {
      return "heavy.png";
    }
    if (mood === "tired") {
      return "tired.png";
    }
    if (mood === "demotivated") {
      return "demotivated.png";
    }
  }

  return (
    <div className="py-5 p-2 select-none transform  scale-90">
      <label
        className={
          props.select
            ? " bg-[#1D80AA] py-[65px]  flex justify-center flex-col cursor-pointer   text-white hover:bg-[#0C86BA] h-[120px] w-[120px] text-center   rounded-[35px] items-center"
            : "py-[65px] flex justify-center flex-col cursor-pointer   hover:text-white hover:bg-[#0C86BA] h-[120px] w-[120px] text-center checked:bg-[#0C86BA] bg-[#5CCBF9] rounded-[35px] items-center "
        }
      >
        <input
          type="checkbox"
          value={props.mood.mood_text}
          name="choice"
          className="hidden self-center form-checkbox  text-center"
          onClick={(event) => {
            // props.onChange(!props.checked);
            props.click(event, props.mood.mood_text);
          }}
          onChange={(event) => {
            let check = event.target.checked;
            if (props.otherEmotion) {
              let count = [];
              let ys = [];
              props.selectedMoods.map((d) => {
                if (d.select) {
                  count.push({
                    select: d.select,
                    mood_text: d.mood_text,
                  });
                }
              });
              props.setSelectedMoods(
                props.selectedMoods.map((m) => {
                  if (m.mood_text === props.mood.mood_text) {
                    // if (count.length <= 5) {
                    console.log(check, "sd");
                    console.log(maxInput, "Please ");
                    if (check && maxInput < 5) {
                      setMaxInput(maxInput + 1);
                      setGetOtherEmotionAll((prevChats) => {
                        return [...prevChats, props.mood.mood_text];
                      });
                      m.select = check;
                    }
                    if (!check && maxInput >= 1) {
                      var index = getOtherEmotionAll.findIndex(
                        (x) => x === props.mood.mood_text
                      );
                      if (index != -1) {
                        let g = [...getOtherEmotionAll];
                        g.splice(index, 1);
                        setGetOtherEmotionAll(g);
                      }

                      setMaxInput(maxInput - 1);
                      m.select = check;
                    }
                    if (count.length >= 5 && maxInput === 5) {
                      console.log(count);
                      if (check === true) {
                        alert("You've selected 5 Emotions already");
                        m.select = false;
                      }
                    }

                    // }
                  }
                  console.log(getOtherEmotionAll);
                  ys.push({
                    select: m.select,
                    mood_text: m.mood_text,
                  });
                  return m;
                })
              );
              setGetOtherEmotionCAnswer(ys);

              // console.log(maxInput, "max");
            } else {
              props.setSelectedMoods(
                props.selectedMoods.map((m) => {
                  if (m.mood_text === props.mood.mood_text) {
                    m.select = check;
                  }
                  return m;
                })
              );
            }
          }}
          checked={props.select}
        />
        <img
          className="w-[80px] h-[80] cursor-pointer"
          src={_handleMoodImg(props.mood.mood_text)}
        />
        <p className="font-bold cursor-pointer inline-block">
          {props.mood.mood_text}
        </p>
      </label>
      {/* <Toaster /> */}
    </div>
  );
};

export default Mood;