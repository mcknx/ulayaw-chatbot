import React, { useState, useEffect } from "react";
import Message from "../Message";
import Mood from "./Mood";

// import Instance from "./Instance";

function GetMoods(props) {
  const [nextBtn, setNextBtn] = useState(true);
  const [prevBtn, setPrevBtn] = useState(false);
  const [doneBtn, setDoneBtn] = useState(true);
  const [moodCount, setMoodCount] = useState(props.payload.length);

  //   useEffect(() => {
  //     console.log(props.payload[0]);
  //     if (moodCount - 9 > -1) {
  //       setMoodCount(moodCount - 9);
  //       //   if (props.payload)
  //     } else if (moodCount - 9 === 0) {
  //       setMoodCount(moodCount - 9);
  //     } else {
  //       setMoodCount(moodCount);
  //     }
  //   }, [moodCount]);

  //   function _handleNextClick() {
  //     setMoodCount(moodCount - 9);
  //     if (moodCount - 9 > -1) {
  //       setMoodCount(moodCount - 9);
  //       setNextBtn(true);
  //       setPrevBtn(true);
  //     } else if (moodCount - 9 === 0) {
  //       setMoodCount(moodCount - 9);
  //       setNextBtn(false);
  //       setPrevBtn(true);
  //     } else {
  //       setMoodCount(0);
  //       setPrevBtn(true);
  //     }
  //     console.log(moodCount);
  //   }

  //   function _handlePrevClick() {
  //     if (moodCount === 0) {
  //       // let s = props.payload.length - moodCount;
  //       setMoodCount(props.payload.length - 9);
  //       setNextBtn(true);
  //       setPrevBtn(true);
  //     }
  //     if (moodCount - 9 > -1) {
  //       setMoodCount(moodCount - 9);
  //       setNextBtn(true);
  //       setPrevBtn(true);
  //     } else if (moodCount - 9 === 0) {
  //       setMoodCount(moodCount - 9);
  //       setPrevBtn(false);
  //     } else {
  //       setMoodCount(0);
  //       setNextBtn(true);
  //     }
  //     console.log(moodCount);
  //   }

  //     function renderChoiceInstance(item, i) {
  //       return (
  //         <Choice
  //           key={i}
  //           click={props.click}
  //           choices={item}
  //           selectedChoices={props.selectedChoices}
  //           setSelectedChoices={props.setSelectedChoices}
  //           currentInstance={props.currentInstance}
  //           question_no={props.item.structValue.fields.question_num.numberValue}
  //           question_text={props.item.structValue.fields.question.stringValue}
  //         />
  //       );
  //     }

  function _handleDoneClick() {
    // props._handleAssessmentResult(total);
    console.log("You are done asdasd!");
    console.log(props.selectedMoods);
    props._handleMoodResult();
  }

  const updateMood = (mood_text, index) => {
    // var index = array.findIndex(x=> x.id === id);

    let g = props.selectedMoods[index];
    g.mood_text = mood_text;

    console.log(g);
  };

  const addMoreMood = (mood_text) => {
    props.setSelectedMoods((prevSelectedMoods) => [
      ...prevSelectedMoods,
      {
        mood_text,
      },
    ]);
    // console.log(selectedMoods);
  };

  const removeMood = (mood_text, index) => {
    let g = [...props.selectedMoods];
    g.splice(index, 1);
    props.setSelectedMoods(g);
    // console.log(g, "g");
    // console.log(selectedMoods, "g-sele");
  };

  function _handleClick(
    // props
    event,
    //   mood_id,
    mood_text
    //   question_text,
    //   choice_text,
    //   choice_score
  ) {
    var index = props.selectedMoods.findIndex((x) => x.mood_text === mood_text);

    if (index === -1) {
      addMoreMood(mood_text);
    } else {
      removeMood(mood_text, index);

      // props.replyClick(event, payload, text);
      // event.preventDefault();
      // event.stopPropagation();
      console.log(props.selectedMoods);
    }
  }

  function renderMood(mood, i) {
    // setCurrentInstance(1);
    return (
      <Mood
        key={i}
        click={_handleClick}
        mood={mood}
        // setMoodCount={setMoodCount}
        // moodCount={moodCount}
        //   instanceLength={instanceLength}
        //   setAssessmentScore={props.setAssessmentScore}
        //   assessmentScore={props.assessmentScore}
        //   currentInstance={currentInstance}
        //   setCurrentInstance={setCurrentInstance}
        setSelectedMoods={props.setSelectedMoods}
        selectedMoods={props.selectedMoods}
        //   _handleDoneClick={_handleDoneClick}
      />
    );
  }

  function renderMoods(moods) {
    if (moods) {
      return (
        <div>
          <div className="flex flex-col">
            {/*  Moods */}

            {/* flex flex-col p-4 */}
            <div className="grid grid-cols-3  ">
              {moods.map((mood, i) => {
                return renderMood(mood, i, moods.length);
              })}
            </div>

            {/* Buttons */}
            <div
              className={
                prevBtn
                  ? "flex flex-row justify-between"
                  : "flex flex-row justify-end"
              }
            >
              {/* prev */}
              {/* <a
                className={
                  prevBtn
                    ? "text-[#0C86BA]  cursor-pointer hover:underline select-none"
                    : "text-[#0C86BA]  cursor-pointer hover:underline select-none hidden"
                }
                onClick={() => _handlePrevClick()}
              >
                Previous
              </a> */}
              {/* next */}
              {/* <a
                className={
                  nextBtn
                    ? "text-[#0C86BA]  cursor-pointer hover:underline select-none"
                    : "text-[#0C86BA]  cursor-pointer hover:underline select-none hidden"
                }
                onClick={() => _handleNextClick()}
              >
                Next
              </a> */}
              {/* done */}
              <a
                className={
                  doneBtn
                    ? "text-[#0C86BA]  cursor-pointer hover:underline select-none"
                    : "text-[#0C86BA]  cursor-pointer hover:underline select-none hidden"
                }
                onClick={(event) => _handleDoneClick(event)}
              >
                Done
              </a>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  return (
    <div className="">
      <Message
        key={props.i}
        speaks={props.speaks}
        text={renderMoods(props.payload)}
      />
    </div>
  );

  //   return (
  //     <div>
  //       {/*  Render moods */}
  //       {renderMoods(props.payload)}
  //     </div>
  //   );
  //   return <div></div>;
}

export default GetMoods;
