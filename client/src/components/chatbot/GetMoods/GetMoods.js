import React, { useState, useEffect, useContext } from "react";
import Message from "../Message";
import Mood from "./Mood";
import { ShowMoodsContext } from "../../../Context/ShowMoodsContext";
import ReactPaginate from "react-paginate";
import { GetHotEmotionCAnswerContext } from "../../../Context/GetHotEmotionCAnswerContext.js";
import { GetOtherEmotionCAnswerContext } from "../../../Context/GetOtherEmotionCAnswerContext.js";
import { ShowChatBox } from "../../../Context/ShowChatBox.js";
import { MaxInputContext } from "../../../Context/MaxInputContext.js";

// import Instance from "./Instance";

function GetMoods(props) {
  // const { showMoods, setShowMoods } = useContext(ShowMoodsContext);
  const [moodsNumber, setMoodsNumber] = useState(0);
  const [checked, setChecked] = useState(false);
  const moodsPerPage = 6;
  const pagesVisited = moodsNumber * moodsPerPage;
  const pageCount = Math.ceil(props.payload.length / moodsPerPage);
  const { getHotEmotionCAnswer, setGetHotEmotionCAnswer } = useContext(
    GetHotEmotionCAnswerContext
  );
  const { getOtherEmotionCAnswer, setGetOtherEmotionCAnswer } = useContext(
    GetOtherEmotionCAnswerContext
  );
  const { showChatBox, setShowChatBox } = useContext(ShowChatBox);
  const [showMoods, setShowMoods] = useState(false);
  const { maxInput, setMaxInput } = useContext(MaxInputContext);

  useEffect(() => {
    setShowChatBox(false);
    if (props.showAtEntrance) {
      setShowMoods(true);
    }

    // console.log(props.payload, "payload");
    // console.log(props.selectedMoods, "moods");

    if (props.selectedMoods.length === 0) {
      props.setSelectedMoods(
        props.payload.map((d) => {
          return {
            select: false,
            mood_text: d.stringValue,
          };
        })
      );
    }
    if (props.otherEmotion) {
      let ys = [];
      if (getOtherEmotionCAnswer != null) {
        getOtherEmotionCAnswer.map((d) => {
          if (!d.select) {
            ys.push({
              select: d.select,
              mood_text: d.mood_text,
            });
          }
        });
      } else {
        props.selectedMoods.map((d) => {
          if (!d.select) {
            ys.push({
              select: d.select,
              mood_text: d.mood_text,
            });
          }
        });
        props.setSelectedMoods([]);
        props.setSelectedMoods(ys);
      }
      // console.log(ys, "ys");
      // console.log(props.selectedMoods);
    }

    // else {
    //   props.setSelectedMoods(
    //     props.selectedMoods.map((d) => {
    //       return {
    //         select: d.select,
    //         mood_text: d.mood_text,
    //       };
    //     })
    //   );
    // }

    // console.log(props.selectedMoods, "moods2");
  }, []);

  function _changePage({ selected }) {
    setMoodsNumber(selected);
  }

  function _handleDoneClick() {
    // console.log(props.selectedMoods);
    if (props.hotEmotion || props.otherEmotion) {
      setShowChatBox(false);
    } else setShowChatBox(true);
    setShowMoods(false);

    if (props.hotEmotion) {
      setGetHotEmotionCAnswer(props.selectedMoods);
    }

    if (props.otherEmotion) {
      setGetOtherEmotionCAnswer(props.selectedMoods);

      // console.log(getOtherEmotionCAnswer, "otheres");
    }
    // console.log(getHotEmotionCAnswer);
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
      // console.log(props.selectedMoods);
    }
  }

  // function _handleCheck(mood, i) {
  //   if (props.selectedMoods.length != 0) {
  //     console.log("asdsd", props.selectedMoods.length);
  //     props.selectedMoods.map((mood1) => {
  //       console.log(mood1.mood_text, "asjk");
  //       if (mood1.mood_text === mood.stringValue) {
  //         console.log(mood.stringValue);
  //         return renderMood(mood, i);
  //       }
  //     });
  //     // for (let i = 0; i < props.selectedMoods.length; i++) {
  //     //   if (props.selectedMoods[i].mood_text === mood.stringValue) {
  //     //     console.log(props.selectedMoods[i].mood_text, "bik");
  //     //     return setChecked(true);
  //     //   }
  //     //   break;
  //     // }
  //   }
  //   return renderMood(mood, i);
  // }
  function renderMood(mood, i) {
    return (
      <Mood
        key={i}
        click={_handleClick}
        mood={mood}
        select={mood.select}
        // setMoodCount={setMoodCount}
        // moodCount={moodCount}
        //   instanceLength={instanceLength}
        //   setAssessmentScore={props.setAssessmentScore}
        //   assessmentScore={props.assessmentScore}
        //   currentInstance={currentInstance}
        //   setCurrentInstance={setCurrentInstance}
        setSelectedMoods={props.setSelectedMoods}
        selectedMoods={props.selectedMoods}
        onChange={setChecked}
        checked={checked}
        dontShowChatBox={props.dontShowChatBox}
        otherEmotion={props.otherEmotion}
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
              {moods
                .slice(pagesVisited, pagesVisited + moodsPerPage)
                .map((mood, i) => {
                  // console.log(mood, "mood");
                  // return _handleCheck(mood, i);
                  return renderMood(mood, i);
                })}
            </div>

            {/* Buttons */}
            <div className="flex flex-col justify-between">
              {/* React Paginate */}
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                previous={"Previous"}
                pageCount={pageCount}
                onPageChange={_changePage}
                containerClassName={"paginationBttns"}
                previousLinkClassName={"previousBttn"}
                nextLinkClassName={"nextBttn"}
                disabledClassName={"paginationDisabled"}
                activeClassName={"paginationActive"}
              />

              {/* done */}
              <a
                className="text-[#0C86BA]  cursor-pointer hover:underline select-none text-center"
                onClick={(event) => {
                  // setShowMoods(!showMoods);
                  // console.log(showMoods, "MOODSDSDS");
                  _handleDoneClick(event);
                }}
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
    <>
      {showMoods ? (
        <div className="">
          <Message
            key={props.i}
            speaks={props.speaks}
            // text={renderMoods(props.payload)}
            text={renderMoods(props.selectedMoods)}
          />
        </div>
      ) : (
        ""
      )}
    </>
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
{
  /* {moods.map((mood, i) => {
                return renderMood(mood, i, moods.length);
              })} */
}
