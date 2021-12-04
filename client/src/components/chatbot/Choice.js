import React, { useState } from "react";

const Choice = (props) => {
  function _handleCheck(event) {
    if (props.selectedChoices[props.currentInstance - 1].choice_text)
      return true;
    return true;
  }

  function _handleChange() {}

  return (
    <div className="flex">
      <label className="cursor-pointer hover:text-[#0C86BA] hover:underline p-0.5 ">
        <input
          type="radio"
          value={props.choices.structValue.fields.text.stringValue}
          name="choice"
          className="self-center mr-2"
          onClick={(event) =>
            props.click(
              event,
              props.question_no,
              props.question_text,
              props.choices.structValue.fields.text.stringValue,
              props.choices.structValue.fields.score.stringValue
            )
          }
          disabled={props.doneAssess}
          // checked={}
        />
        {props.choices.structValue.fields.text.stringValue}
      </label>
    </div>
  );
};

export default Choice;
