import React, { useState } from "react";

const Mood = (props) => {
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
  return (
    <div className="py-5 p-2 select-none">
      <label className="py-10  flex justify-center flex-col cursor-pointer   hover:text-white hover:bg-[#0C86BA] h-[120px] w-[105px] text-center checked:bg-[#0C86BA] checked:border-transparent bg-[#3D829F] rounded-[35px]">
        <input
          type="checkbox"
          value={props.mood.stringValue}
          name="choice"
          className="self-center form-checkbox  text-center"
          onClick={(event) => props.click(event, props.mood.stringValue)}
          // onChange={_handleCheck}
          // checked={_handleCheck}
        />
        <p className="font-bold cursor-pointer inline-block">
          {props.mood.stringValue}
        </p>
      </label>
    </div>
  );
};

export default Mood;
