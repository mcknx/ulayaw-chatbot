import React, { useState } from "react";
import Message from "./Message";
import Instance from "./Instance";

function MultipleChoice(props) {
  const [currentInstance, setCurrentInstance] = useState(1);
  const [selectedChoices, setSelectedChoices] = useState([]);

  function _handleDoneClick() {
    if (currentInstance == 4) {
      let total = 0;
      for (let i = 0; i < selectedChoices.length; i++) {
        total += parseInt(selectedChoices[i].choice_score);
      }
      props._handleAssessmentResult(total);
      // console.log(total);
      // console.log("You are done asdasd!");
      // console.log(selectedChoices);
      // props.setCurrentInstance();
    }
  }

  const addMoreItem = (
    question_no,
    question_text,
    choice_text,
    choice_score
  ) => {
    setSelectedChoices((prevSelectedChoices) => [
      ...prevSelectedChoices,
      {
        question_no,
        question_text,
        choice_text,
        choice_score,
      },
    ]);
    console.log(selectedChoices);
  };

  const updateItem = (id, newChoice_text, newChoice_score, index) => {
    // var index = array.findIndex(x=> x.id === id);

    let g = selectedChoices[index];
    g.choice_text = newChoice_text;
    g.choice_score = newChoice_score;

    console.log(g);
  };

  function _handleClick(
    // props
    event,
    question_no,
    question_text,
    choice_text,
    choice_score
  ) {
    var index = selectedChoices.findIndex((x) => x.question_no === question_no);

    if (index === -1) {
      addMoreItem(question_no, question_text, choice_text, choice_score);
    } else {
      updateItem(question_no, choice_text, choice_score, index);

      // props.replyClick(event, payload, text);
      // event.preventDefault();
      // event.stopPropagation();
      console.log(selectedChoices);
    }
  }

  function renderInstance(item, i, instanceLength) {
    // setCurrentInstance(1);
    return (
      <Instance
        key={i}
        click={_handleClick}
        item={item}
        instanceLength={instanceLength}
        setAssessmentScore={props.setAssessmentScore}
        assessmentScore={props.assessmentScore}
        currentInstance={currentInstance}
        setCurrentInstance={setCurrentInstance}
        setSelectedChoices={setSelectedChoices}
        selectedChoices={selectedChoices}
        _handleDoneClick={_handleDoneClick}
      />
    );
  }

  function renderMultipleChoice(instance) {
    if (instance) {
      return instance.map((item, i) => {
        return renderInstance(item, i, instance.length);
      });
    } else {
      return null;
    }
  }

  return (
    <div>
      {/*  MultipleChoice Instances */}
      <Message
        key={props.i}
        speaks={props.speaks}
        text={renderMultipleChoice(props.payload)}
      />
    </div>
  );
}

export default MultipleChoice;
