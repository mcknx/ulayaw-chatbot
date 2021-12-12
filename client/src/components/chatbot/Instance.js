import React, { useState, useEffect, useContext } from "react";
import Choice from "./Choice";
import { ShowChatBox } from "../../Context/ShowChatBox";
const Instance = (props) => {
  const [nextBtn, setNextBtn] = useState(true);
  const [prevBtn, setPrevBtn] = useState(true);
  const [doneBtn, setDoneBtn] = useState(false);
  const { showChatBox, setShowChatBox } = useContext(ShowChatBox);
  useEffect(() => {
    if (props.item.structValue.fields.question_num.numberValue === 4) {
      setNextBtn(false);
      setDoneBtn(true);
    }

    if (props.item.structValue.fields.question_num.numberValue === 1) {
      setPrevBtn(false);
    }
    // setShowChatBox(false);
  });

  function renderChoiceInstance(item, i, select) {
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
        doneAssess={props.doneAssess}
        select={select}
      />
    );
  }

  function renderChoice(instance) {
    if (instance) {
      // console.log(instance);
      // console.log(props.selectedChoices);
      return instance.map((item, i) => {
        let select;
        if (props.selectedChoices) {
          if (props.selectedChoices !== undefined) {
            if (props.selectedChoices.length !== 0) {
              props.selectedChoices.map((selected, ind) => {
                if (
                  props.item.structValue.fields.question_num.numberValue ===
                  selected.question_no
                ) {
                  if (
                    selected.choice_text ===
                    item.structValue.fields.text.stringValue
                  ) {
                    select = true;
                  }
                }
                // props.item.structValue.fields.question_num.numberValue
              });
              console.log("props.selectedChoices length");
            }
            console.log("props.selectedChoices undefined");
          }
          console.log("props.selectedChoices");
        }
        console.log(select);

        console.log(item);
        return renderChoiceInstance(item, i, select);
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
          {!props.doneAssess ? (
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
          ) : (
            ""
          )}
          {/* next */}
          {!props.doneAssess ? (
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
          ) : (
            ""
          )}
          {/* done */}
          {!props.doneAssess ? (
            <a
              className={
                doneBtn
                  ? "text-[#0C86BA]  cursor-pointer hover:underline select-none"
                  : "text-[#0C86BA]  cursor-pointer hover:underline select-none hidden"
              }
              onClick={(event) => {
                props._handleDoneClick(event);
                // setShowChatBox(true);
              }}
            >
              Done
            </a>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
  return <div></div>;
};

export default Instance;
