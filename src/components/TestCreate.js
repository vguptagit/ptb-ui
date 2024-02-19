import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { FormattedMessage } from "react-intl";
import { Form } from "react-bootstrap";
import { useDrop } from "react-dnd";
import QuestionsBanksTips from "./testTabs/QuestionsBanksTips/QuestionsBanksTips";
import Essay from "./questions/Essay";
import FillInBlanks from "./questions/FillInBlanks";
import Matching from "./questions/Matching";
import MultipleChoice from "./questions/MultipleChoice";
import MultipleResponse from "./questions/MultipleResponse";
import TrueFalse from "./questions/TrueFalse";
import CustomQuestionBanksService from "../services/CustomQuestionBanksService";
import QtiService from "../utils/qtiService";
import "./TestCreate.css";

const TestCreate = () => {
  const { selectedTest, dispatchEvent } = useAppContext();
  const [tabTitle, setTabTitle] = useState(selectedTest?.title || "");
  const [initialTabTitle, setInitialTabTitle] = useState(""); 
  const [isEditing, setIsEditing] = useState(false);
  const [questionListSize, setQuestionListSize] = useState(0);

  useEffect(() => {
    setTabTitle(selectedTest?.title || "");
    setInitialTabTitle(selectedTest?.title || ""); 
  }, [selectedTest]);

  const handleTitleChange = (event) => {
    const newTitle = event.target.value;
    setTabTitle(newTitle);
    setIsEditing(true); 
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (tabTitle.trim().length === 0) {
      
      return;
    } else {
      dispatchEvent("UPDATE_TEST_TITLE", { id: selectedTest.id, title: tabTitle });
      setInitialTabTitle(tabTitle); 
    }
    setIsEditing(false); 
  };

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ["QUESTION_TEMPLATE", "TREE_NODE"],
    drop: (item) => {
      console.log("Dropped node:", item);
      if (item.type === "QUESTION_TEMPLATE") {
        selectedTest.questions.push(getQuestion(item.questionTemplate));
      } else if (item.type === "TREE_NODE") {
        selectedTest.questions.push(getQuestion(item.questionTemplate));
      } else {
        selectedTest.questions.push(getQuestion(item.questionTemplate));
      }

      dispatchEvent("SAVE_TEST_TAB", { id: selectedTest.id });
      setIsEditing(true);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  
  const getQuestion = (questionNode) => {
    let question = questionNode;
    var qtiModel = QtiService.getQtiModel(questionNode.data, questionNode.quizType);
    qtiModel.EditOption = true;
    question.qtiModel = qtiModel;
    console.log(question);
    return question;
  };

  const handleQuestionState = (edit) => {
    setIsEditing(edit);
  };

  const handleQuestionDelete = (deleteIndex) => {
    if (deleteIndex > -1) {
      selectedTest.questions.splice(deleteIndex, 1);
      setQuestionListSize(selectedTest.questions.length + 1);
    }
  };

  const renderQuestions = (questionNode, index) => {
    switch (questionNode.quizType) {
      case CustomQuestionBanksService.MultipleChoice:
        return <MultipleChoice
          questionNode={questionNode}
          key={Date.now() + "_" + selectedTest.id + questionListSize + "_" + index}
          questionNodeIndex={index}
          questionNodeIsEdit={questionNode.qtiModel.EditOption}
          onQuestionStateChange={handleQuestionState}
          onQuestionDelete={handleQuestionDelete}
        />;
      case CustomQuestionBanksService.MultipleResponse:
        return <MultipleResponse
          questionNode={questionNode}
          key={Date.now() + "_" + selectedTest.id + questionListSize + "_" + index}
          questionNodeIndex={index}
          questionNodeIsEdit={questionNode.qtiModel.EditOption}
          onQuestionStateChange={handleQuestionState}
          onQuestionDelete={handleQuestionDelete}
        />;
      case CustomQuestionBanksService.TrueFalse:
        return <TrueFalse
          questionNode={questionNode}
          key={Date.now() + "_" + selectedTest.id + questionListSize + "_" + index}
          questionNodeIndex={index}
          questionNodeIsEdit={questionNode.qtiModel.EditOption}
          onQuestionStateChange={handleQuestionState}
          onQuestionDelete={handleQuestionDelete}
        />;
      case CustomQuestionBanksService.Matching:
        return <Matching
          questionNode={questionNode}
          key={Date.now() + "_" + selectedTest.id + questionListSize + "_" + index}
          questionNodeIndex={index}
          questionNodeIsEdit={questionNode.qtiModel.EditOption}
          onQuestionStateChange={handleQuestionState}
          onQuestionDelete={handleQuestionDelete}
        />;
      case CustomQuestionBanksService.FillInBlanks:
        return <FillInBlanks
          questionNode={questionNode}
          key={Date.now() + "_" + selectedTest.id + questionListSize + "_" + index}
          questionNodeIndex={index}
          questionNodeIsEdit={questionNode.qtiModel.EditOption}
          onQuestionStateChange={handleQuestionState}
          onQuestionDelete={handleQuestionDelete}
        />;
      case CustomQuestionBanksService.Essay:
        return <Essay
          questionNode={questionNode}
          key={Date.now() + "_" + selectedTest.id + questionListSize + "_" + index}
          questionNodeIndex={index}
          questionNodeIsEdit={questionNode.qtiModel.EditOption}
          onQuestionStateChange={handleQuestionState}
          onQuestionDelete={handleQuestionDelete}
        />;
      default:
        return <div></div>;
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
            <Form onSubmit={handleSubmit}>
              <Form.Control
                type="text"
                name="title"
                placeholder="Enter Test title "
                value={isEditing ? tabTitle : initialTabTitle} 
                onChange={handleTitleChange}
                className="rounded"
                required={true}
              />
            </Form>
          </div>
        </div>
      </div>
      <div className="test-container">
        {selectedTest && selectedTest.questions && selectedTest.questions.map((questionNode, index) => (
          renderQuestions(questionNode, index)
        ))}
      </div>
      <div
        ref={drop}
        className={`test-container ${
          canDrop && isOver && !isEditing ? "drop-active" : ""
        }`}
      >
        <div>
          {selectedTest && selectedTest.questions && selectedTest.questions.length !== 0 ? (
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
