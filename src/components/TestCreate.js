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
import "./_tables.css";
import TreeViewTestCreate from "./TreeViewTestCreate";

const TestCreate = () => {
  const { selectedTest, dispatchEvent } = useAppContext();
  const [tabTitle, setTabTitle] = useState(selectedTest?.title || "");
  const [initialTabTitle, setInitialTabTitle] = useState(
    selectedTest?.title || ""
  );
  const [isEditing, setIsEditing] = useState(true);
  const [refreshChildren, setRefreshChildren] = useState(false);
  const [questionListSize, setQuestionListSize] = useState(0);
  const [formSubmittedOnce, setFormSubmittedOnce] = useState(false);
  const [isTitleValid, setIsTitleValid] = useState(false);

  useEffect(() => {
    setTabTitle(selectedTest?.title || "");
    setInitialTabTitle(selectedTest?.title || "");
  }, [selectedTest]);
  const handleTitleChange = (event) => {
    let newTitle = event.target.value;

    // Allow special characters, numbers, alphabets, and spaces
    newTitle = newTitle.replace(/[^a-zA-Z0-9!@#$%^&*(),.?":{}|<>\s]/g, "");

    if (newTitle.length > 255) {
      newTitle = newTitle.slice(0, 255);
    }
    newTitle = newTitle.charAt(0).toUpperCase() + newTitle.slice(1);

    setTabTitle(newTitle);
    setIsEditing(true);

    // Update the title in the selectedTest object
    if (selectedTest && selectedTest.id) {
      // Create a copy of the selectedTest object
      const updatedSelectedTest = { ...selectedTest };
      // Update the title property with the new title
      updatedSelectedTest.title = newTitle;
      // Dispatch an action to update the selectedTest object in the context
      dispatchEvent("UPDATE_TEST_TITLE", updatedSelectedTest);
    }
  };
  console.log("updatedtitle", tabTitle);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (tabTitle.trim().length === 0) {
      return;
    } else {
      dispatchEvent("UPDATE_TEST_TITLE", {
        id: selectedTest.id,
        title: tabTitle,
      });
      setInitialTabTitle(tabTitle);
      setIsEditing(false);
      setFormSubmittedOnce(true);
    }
  };

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ["QUESTION_TEMPLATE", "TREE_NODE", "SAVED_QUESTION"],
    drop: (item) => {
      console.log("Dropped node:", item);
      let copyItem = JSON.parse(JSON.stringify(item));
      if (item.type === "QUESTION_TEMPLATE") {
        selectedTest.questions.push(getQuestion(copyItem.questionTemplate));
      } else if (item.type === "TREE_NODE") {
        selectedTest.questions.push(getQuestion(copyItem.questionTemplate));
      } else if (item.question) {
        selectedTest.questions.push(item.question);
      } else {
        selectedTest.questions.push(getQuestion(copyItem.questionTemplate));
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
    var qtiModel = QtiService.getQtiModel(
      questionNode.data,
      questionNode.quizType
    );
    qtiModel.EditOption = true;
    question.qtiModel = qtiModel;
    questionNode.itemId = Math.random().toString(36).slice(2);
    console.log(question);
    return question;
  };

  const handleQuestionState = (edit) => {
    setRefreshChildren(!refreshChildren);
  };

  const handleQuestionDelete = (deleteIndex) => {
    if (deleteIndex > -1) {
      selectedTest.questions.splice(deleteIndex, 1);
      setQuestionListSize(selectedTest.questions.length + 1);
    }
  };

  const renderQuestions = (questionNode, index) => {
    const key = questionNode.itemId || questionNode.guid;
    if (questionNode.quizType) {
      switch (questionNode.quizType) {
        case CustomQuestionBanksService.MultipleChoice:
          return (
            <MultipleChoice
              questionNode={questionNode}
              key={key}
              questionNodeIndex={index}
              questionNodeIsEdit={questionNode.qtiModel.EditOption}
              onQuestionStateChange={handleQuestionState}
              onQuestionDelete={handleQuestionDelete}
            />
          );
        case CustomQuestionBanksService.MultipleResponse:
          return (
            <MultipleResponse
              questionNode={questionNode}
              key={key}
              questionNodeIndex={index}
              questionNodeIsEdit={questionNode.qtiModel.EditOption}
              onQuestionStateChange={handleQuestionState}
              onQuestionDelete={handleQuestionDelete}
            />
          );
        case CustomQuestionBanksService.TrueFalse:
          return (
            <TrueFalse
              questionNode={questionNode}
              key={key}
              questionNodeIndex={index}
              questionNodeIsEdit={questionNode.qtiModel.EditOption}
              onQuestionStateChange={handleQuestionState}
              onQuestionDelete={handleQuestionDelete}
            />
          );
        case CustomQuestionBanksService.Matching:
          return (
            <Matching
              questionNode={questionNode}
              key={key}
              questionNodeIndex={index}
              questionNodeIsEdit={questionNode.qtiModel.EditOption}
              onQuestionStateChange={handleQuestionState}
              onQuestionDelete={handleQuestionDelete}
            />
          );
        case CustomQuestionBanksService.FillInBlanks:
          return (
            <FillInBlanks
              questionNode={questionNode}
              key={key}
              questionNodeIndex={index}
              questionNodeIsEdit={questionNode.qtiModel.EditOption}
              onQuestionStateChange={handleQuestionState}
              onQuestionDelete={handleQuestionDelete}
            />
          );
        case CustomQuestionBanksService.Essay:
          return (
            <Essay
              questionNode={questionNode}
              key={key}
              questionNodeIndex={index}
              questionNodeIsEdit={questionNode.qtiModel.EditOption}
              onQuestionStateChange={handleQuestionState}
              onQuestionDelete={handleQuestionDelete}
            />
          );
        default:
          return null;
      }
    } else if (questionNode.metadata && questionNode.metadata.quizType) {
      switch (questionNode.metadata.quizType) {
        case CustomQuestionBanksService.MultipleChoice:
          return (
            <MultipleChoice
              questionNode={questionNode}
              key={key}
              questionNodeIndex={index}
              questionNodeIsEdit={questionNode.qtiModel.EditOption}
              onQuestionStateChange={handleQuestionState}
              onQuestionDelete={handleQuestionDelete}
            />
          );
        case CustomQuestionBanksService.MultipleResponse:
          return (
            <MultipleResponse
              questionNode={questionNode}
              key={key}
              questionNodeIndex={index}
              questionNodeIsEdit={questionNode.qtiModel.EditOption}
              onQuestionStateChange={handleQuestionState}
              onQuestionDelete={handleQuestionDelete}
            />
          );
        case CustomQuestionBanksService.TrueFalse:
          return (
            <TrueFalse
              questionNode={questionNode}
              key={key}
              questionNodeIndex={index}
              questionNodeIsEdit={questionNode.qtiModel.EditOption}
              onQuestionStateChange={handleQuestionState}
              onQuestionDelete={handleQuestionDelete}
            />
          );
        case CustomQuestionBanksService.Matching:
          return (
            <Matching
              questionNode={questionNode}
              key={key}
              questionNodeIndex={index}
              questionNodeIsEdit={questionNode.qtiModel.EditOption}
              onQuestionStateChange={handleQuestionState}
              onQuestionDelete={handleQuestionDelete}
            />
          );
        case CustomQuestionBanksService.FillInBlanks:
          return (
            <FillInBlanks
              questionNode={questionNode}
              key={key}
              questionNodeIndex={index}
              questionNodeIsEdit={questionNode.qtiModel.EditOption}
              onQuestionStateChange={handleQuestionState}
              onQuestionDelete={handleQuestionDelete}
            />
          );
        case CustomQuestionBanksService.Essay:
          return (
            <Essay
              questionNode={questionNode}
              key={key}
              questionNodeIndex={index}
              questionNodeIsEdit={questionNode.qtiModel.EditOption}
              onQuestionStateChange={handleQuestionState}
              onQuestionDelete={handleQuestionDelete}
            />
          );
        default:
          return null;
      }
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
                placeholder="Enter Test title"
                value={tabTitle}
                onChange={handleTitleChange}
                className={`rounded ${
                  !isTitleValid && tabTitle.trim() === "" ? "is-invalid" : ""
                }`}
                required={true}
              />
            </Form>
          </div>
        </div>
      </div>
      <div className="test-container">
        {selectedTest && selectedTest.questions && (
          <TreeViewTestCreate
            data={selectedTest.questions}
            renderQuestions={renderQuestions}
          />
        )}
      </div>
      <div
        ref={drop}
        className={`test-container ${
          canDrop && isOver && !isEditing ? "drop-active" : ""
        }`}
      >
        <div>
          {selectedTest &&
          selectedTest.questions &&
          selectedTest.questions.length !== 0 ? (
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
