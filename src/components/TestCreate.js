import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { FormattedMessage } from "react-intl";
import { Form } from "react-bootstrap";
import { useDrop } from "react-dnd";
import QuestionsBanksTips from "./testTabs/QuestionsBanksTips/QuestionsBanksTips";
import Essay from "./questions/Essay";
import CustomQuestionBanksService from "../services/CustomQuestionBanksService";
import QtiService from "../utils/qtiService";
import "./TestCreate.css";

const TestCreate = () => {
  const { selectedTest, dispatchEvent } = useAppContext();
  const [newTabName, setNewTabName] = useState(selectedTest?.title || "");
  const [droppedNode, setDroppedNode] = useState(null);
  const [childEditMode, setChildEditMode] = useState(false);
  const [questionListSize, setQuestionListSize] = useState(0);

  useEffect(() => {
    setNewTabName(selectedTest?.title || "");
  }, [selectedTest]);

  const handleTitleChange = (event) => {
    let newTitle = event.target.value;

    // Truncate the title if it exceeds 12 characters including white space
    if (newTitle.length > 12) {
      newTitle = newTitle.substring(0, 12);
    }

    if (selectedTest && selectedTest.id) {
      setNewTabName(newTitle);
      dispatchEvent("UPDATE_TEST_TITLE", { id: selectedTest.id, title: newTitle });
    }
  };

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ["QUESTION_TEMPLATE", "TREE_NODE"],
    drop: (item) => {
      console.log("Dropped node:", item.node);
      console.log("Dropped node:", item.questionTemplate);
      let questions = selectedTest.questions || [];

      if (item.type === "QUESTION_TEMPLATE") {
        questions.push(getQuestion("Essay"));
      } else if (item.type === "TREE_NODE") {
        questions.push(getQuestion("Essay"));
      }

      dispatchEvent("SAVE_TEST_TAB", { id: selectedTest.id, questions });
      setChildEditMode(true);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const getQuestion = (questionType) => {
    let question = {};
    if (questionType === "Essay") {
      const essayTemplate = CustomQuestionBanksService.Essay_Template;
      var qtiModel = QtiService.getQtiModel(essayTemplate, "Essay");
      qtiModel.EditOption = true;
      question.qtiModel = qtiModel;
    }
    return question;
  };

  const handleQuestionState = (edit) => {
    setChildEditMode(edit);
  };

  const handleQuestionDelete = (deleteIndex) => {
    if (deleteIndex > -1) {
      selectedTest.questions.splice(deleteIndex, 1);
      setQuestionListSize(selectedTest.questions.length + 1);
    }
  };

  return (
    <div>
      <div className="test-container">
        <div className="d-flex align-items-center p-1 addfolder-container">
          <div className="flex-grow-1 mr-21 d-flex align-items-center">
            <div className="ml-2">
              <FormattedMessage id="testName" />
            </div>
            <Form.Control
              type="text"
              name="title"
              placeholder="Enter Test title "
              value={newTabName}
              onChange={handleTitleChange}
              className="rounded"
            />
          </div>
        </div>
      </div>
      <div className="test-container">
        {selectedTest.questions &&
          selectedTest.questions.map((questionNode, index) => (
            <Essay
              questionNode={questionNode}
              key={Date.now() + "_" + selectedTest.id + questionListSize + "_" + index}
              questionNodeIndex={index}
              questionNodeIsEdit={questionNode.qtiModel.EditOption}
              onQuestionStateChange={handleQuestionState}
              onQuestionDelete={handleQuestionDelete}
            />
          ))}
      </div>
      <div
        ref={drop}
        className={`test-container ${
          canDrop && isOver && !childEditMode ? "drop-active" : ""
        }`}
      >
        <div>
          {selectedTest.questions && selectedTest.questions.length !== 0 ? (
            <div className="drag-container align-items-center d-flex justify-content-center">
              Drag Questions Here{" "}
            </div>
          ) : (
            <QuestionsBanksTips />
          )}
        </div>
      </div>
    </div>
  );
};

export default TestCreate;
