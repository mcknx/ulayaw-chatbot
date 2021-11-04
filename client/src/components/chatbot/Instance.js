import React, { useState, useEffect } from "react";
import Choice from "./Choice";

const Instance = (props) => {
  const [nextBtn, setNextBtn] = useState(true);
  const [prevBtn, setPrevBtn] = useState(true);
  const [doneBtn, setDoneBtn] = useState(false);

  useEffect(() => {
    if (props.item.structValue.fields.question_num.numberValue === 4) {
      setNextBtn(false);
      setDoneBtn(true);
    }

    if (props.item.structValue.fields.question_num.numberValue === 1) {
      setPrevBtn(false);
    }
  });

  function renderChoiceInstance(item, i) {
    return (
      <Choice
        key={i}
        click={props.click}
        choices={item}
        selectedChoices={props.selectedChoices}
        setSelectedChoices={props.setSelectedChoices}
        currentInstance={props.currentInstance}
        question_no={props.item.structValue.fields.question_num.numberValue}
        question_text={props.item.structValue.fields.question.stringValue}
      />
    );
  }

  function renderChoice(instance) {
    if (instance) {
      return instance.map((item, i) => {
        return renderChoiceInstance(item, i);
      });
    } else {
      return null;
    }
  }

  function _handleNextClick() {
    if (props.currentInstance < 4) {
      props.setCurrentInstance(props.currentInstance + 1);
    }
  }

  function _handlePrevClick() {
    if (props.currentInstance >= 1) {
      props.setCurrentInstance(props.currentInstance - 1);
    }
  }

  // console.log(props.currentInstance);
  // console.log(props.item.structValue.fields.question_num.numberValue);
  if (
    props.currentInstance ===
    props.item.structValue.fields.question_num.numberValue
  ) {
    return (
      <div className="flex flex-col">
        {/*  Question identifer */}
        <div className="text-[#0C86BA] pb-2">
          Question {props.item.structValue.fields.question_num.numberValue} of{" "}
          {props.instanceLength}
        </div>

        {/*  Question */}

        <div>
          <form> {props.item.structValue.fields.question.stringValue} </form>
        </div>

        {/*  Choices */}
        <div className="flex flex-col p-4 ">
          {renderChoice(props.item.structValue.fields.choices.listValue.values)}
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
          <a
            className={
              prevBtn
                ? "text-[#0C86BA]  cursor-pointer hover:underline select-none"
                : "text-[#0C86BA]  cursor-pointer hover:underline select-none hidden"
            }
            onClick={() => _handlePrevClick()}
          >
            Previous
          </a>
          {/* next */}
          <a
            className={
              nextBtn
                ? "text-[#0C86BA]  cursor-pointer hover:underline select-none"
                : "text-[#0C86BA]  cursor-pointer hover:underline select-none hidden"
            }
            onClick={() => _handleNextClick()}
          >
            Next
          </a>
          {/* done */}
          <a
            className={
              doneBtn
                ? "text-[#0C86BA]  cursor-pointer hover:underline select-none"
                : "text-[#0C86BA]  cursor-pointer hover:underline select-none hidden"
            }
            onClick={(event) => props._handleDoneClick(event)}
          >
            Done
          </a>
        </div>
      </div>
    );
  }
  return <div></div>;
};

export default Instance;
