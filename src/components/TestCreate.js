import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { FormattedMessage } from 'react-intl';
import { Button, Form, Modal } from 'react-bootstrap';
import { useDrop } from 'react-dnd';
import QuestionsBanksTips from './testTabs/QuestionsBanksTips/QuestionsBanksTips';
import Essay from './questions/Essay';
import FillInBlanks from './questions/FillInBlanks';
import Matching from './questions/Matching';
import MultipleChoice from './questions/MultipleChoice';
import MultipleResponse from './questions/MultipleResponse';
import TrueFalse from './questions/TrueFalse';
import CustomQuestionsService from '../services/CustomQuestionsService';
import QtiService from '../utils/qti-converter';
import './TestCreate.css';
import './_tables.css';
import TreeViewTestCreate from './TreeViewTestCreate';
import jquery from 'jquery';

const TestCreate = () => {
  const { selectedTest, dispatchEvent, setSelectedTest, handleHideDuplicateModal, showDuplicateModal, handleQuestion } =
    useAppContext();
  const [tabTitle, setTabTitle] = useState(selectedTest?.title || '');
  const [initialTabTitle, setInitialTabTitle] = useState(selectedTest?.title || '');
  const [isEditing, setIsEditing] = useState(true);
  const [refreshChildren, setRefreshChildren] = useState(false);
  const [questionListSize, setQuestionListSize] = useState(0);
  const [formSubmittedOnce, setFormSubmittedOnce] = useState(false);
  const [isTitleValid, setIsTitleValid] = useState(false);

  useEffect(() => {
    setTabTitle(selectedTest?.title || '');
    setInitialTabTitle(selectedTest?.title || '');
  }, [selectedTest]);

  const handleTitleChange = event => {
    let newTitle = event.target.value;

    // Allow all special characters, numbers, alphabets, and spaces
    newTitle = newTitle.slice(0, 255); // Limiting the length to 255 characters as per your code
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
      dispatchEvent('UPDATE_TEST_TITLE', updatedSelectedTest);
    }
  };
  console.log('updatedtitle', tabTitle);

  const handleSubmit = event => {
    event.preventDefault();
    if (tabTitle.trim().length === 0) {
      return;
    } else {
      dispatchEvent('UPDATE_TEST_TITLE', {
        id: selectedTest.id,
        title: tabTitle,
      });
      setInitialTabTitle(tabTitle);
      setIsEditing(false);
      setFormSubmittedOnce(true);
    }
  };

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ['QUESTION_TEMPLATE', 'TREE_NODE', 'SAVED_QUESTION'],
    drop: item => {
      console.log('Dropped node:', item);
      let copyItem = JSON.parse(JSON.stringify(item));
      if (item.type === 'QUESTION_TEMPLATE') {
        selectedTest.questions.push(getQuestion(copyItem.questionTemplate));
      } else if (item.type === 'TREE_NODE') {
        selectedTest.questions.push(getQuestion(copyItem.questionTemplate));
      } else if (item.question) {
        let question = copyItem.question;
        var qtiModel = QtiService.getQtiModel(question.qtixml, question.metadata.quizType);
        qtiModel.EditOption = false;
        question.qtiModel = qtiModel;
        question.masterData = JSON.parse(JSON.stringify(qtiModel)); //
        question.itemId = copyItem.question.guid;
        question.quizType = question.metadata.quizType;
        question.data = question.qtixml; //
        console.log(question);
        const questionTemplates = CustomQuestionsService.questionTemplates(question);
        if (question.quizType == 'FillInBlanks') {
          let xmlToHtml = getPrintModeFbCaption(question.qtiModel.Caption);
          console.log(xmlToHtml);
          question.textHTML = xmlToHtml;
        } else {
          let xmlToHtml = questionTemplates[0].textHTML;
          console.log(xmlToHtml);
          question.textHTML = xmlToHtml;
        }
        question.spaceLine = 0;
        selectedTest.questions.push(question);
      } else {
        selectedTest.questions.push(getQuestion(copyItem.questionTemplate));
      }

      dispatchEvent('SAVE_TEST_TAB', { id: selectedTest.id });
      setIsEditing(true);
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const getQuestion = questionNode => {
    let question = questionNode;
    var qtiModel = QtiService.getQtiModel(questionNode.data, questionNode.quizType);
    qtiModel.EditOption = true;
    question.qtiModel = qtiModel;
    questionNode.itemId = Math.random().toString(36).slice(2);
    console.log(question);
    return question;
  };

  const getPrintModeFbCaption = Caption => {
    try {
      var htmlText = Caption.trim().replaceAll('&amp;nbsp;', ' ');
      htmlText = htmlText.replaceAll('&lt;', '<').replaceAll('&gt;', '>');
      var element = jquery('<p></p>');
      jquery(element).append(htmlText);
      element.find('button').each(function (i, obj) {
        let blankSpace = "<span class='blank'> _____________________ </span>";
        jquery(obj).replaceWith(blankSpace);
      });
      return element[0].innerHTML;
    } catch (e) {}
  };

  const handleQuestionState = edit => {
    setRefreshChildren(!refreshChildren);
  };

  const handleQuestionDelete = deleteIndex => {
    if (deleteIndex > -1) {
      selectedTest.questions.splice(deleteIndex, 1);
      setQuestionListSize(selectedTest.questions.length + 1);
    }
  };

  const renderQuestions = (questionNode, index) => {
    const key = questionNode.itemId || questionNode.guid;
    if (questionNode.quizType) {
      switch (questionNode.quizType) {
        case CustomQuestionsService.MultipleChoice:
          return (
            <MultipleChoice
              questionNode={questionNode}
              printView={2}
              key={key}
              questionNodeIndex={index}
              questionNodeIsEdit={questionNode.qtiModel.EditOption}
              onQuestionStateChange={handleQuestionState}
              onQuestionDelete={handleQuestionDelete}
              selectedTest={selectedTest}
              setSelectedTest={setSelectedTest}
            />
          );
        case CustomQuestionsService.MultipleResponse:
          return (
            <MultipleResponse
              questionNode={questionNode}
              printView={2}
              key={key}
              questionNodeIndex={index}
              questionNodeIsEdit={questionNode.qtiModel.EditOption}
              onQuestionStateChange={handleQuestionState}
              onQuestionDelete={handleQuestionDelete}
              selectedTest={selectedTest}
              setSelectedTest={setSelectedTest}
            />
          );
        case CustomQuestionsService.TrueFalse:
          return (
            <TrueFalse
              questionNode={questionNode}
              printView={2}
              key={key}
              questionNodeIndex={index}
              questionNodeIsEdit={questionNode.qtiModel.EditOption}
              onQuestionStateChange={handleQuestionState}
              onQuestionDelete={handleQuestionDelete}
              selectedTest={selectedTest}
              setSelectedTest={setSelectedTest}
            />
          );
        case CustomQuestionsService.Matching:
          return (
            <Matching
              questionNode={questionNode}
              printView={2}
              key={key}
              questionNodeIndex={index}
              questionNodeIsEdit={questionNode.qtiModel.EditOption}
              onQuestionStateChange={handleQuestionState}
              onQuestionDelete={handleQuestionDelete}
              selectedTest={selectedTest}
              setSelectedTest={setSelectedTest}
            />
          );
        case CustomQuestionsService.FillInBlanks:
          return (
            <FillInBlanks
              questionNode={questionNode}
              printView={2}
              key={key}
              questionNodeIndex={index}
              questionNodeIsEdit={questionNode.qtiModel.EditOption}
              onQuestionStateChange={handleQuestionState}
              onQuestionDelete={handleQuestionDelete}
              selectedTest={selectedTest}
              setSelectedTest={setSelectedTest}
            />
          );
        case CustomQuestionsService.Essay:
          return (
            <Essay
              questionNode={questionNode}
              printView={2}
              key={key}
              questionNodeIndex={index}
              questionNodeIsEdit={questionNode.qtiModel.EditOption}
              onQuestionStateChange={handleQuestionState}
              onQuestionDelete={handleQuestionDelete}
              selectedTest={selectedTest}
              setSelectedTest={setSelectedTest}
            />
          );
        default:
          return null;
      }
    } else if (questionNode.metadata && questionNode.metadata.quizType) {
      switch (questionNode.metadata.quizType) {
        case CustomQuestionsService.MultipleChoice:
          return (
            <MultipleChoice
              questionNode={questionNode}
              key={key}
              printView={2}
              questionNodeIndex={index}
              questionNodeIsEdit={questionNode.qtiModel.EditOption}
              onQuestionStateChange={handleQuestionState}
              onQuestionDelete={handleQuestionDelete}
              selectedTest={selectedTest}
              setSelectedTest={setSelectedTest}
            />
          );
        case CustomQuestionsService.MultipleResponse:
          return (
            <MultipleResponse
              questionNode={questionNode}
              key={key}
              printView={2}
              questionNodeIndex={index}
              questionNodeIsEdit={questionNode.qtiModel.EditOption}
              onQuestionStateChange={handleQuestionState}
              onQuestionDelete={handleQuestionDelete}
              selectedTest={selectedTest}
              setSelectedTest={setSelectedTest}
            />
          );
        case CustomQuestionsService.TrueFalse:
          return (
            <TrueFalse
              questionNode={questionNode}
              key={key}
              printView={2}
              questionNodeIndex={index}
              questionNodeIsEdit={questionNode.qtiModel.EditOption}
              onQuestionStateChange={handleQuestionState}
              onQuestionDelete={handleQuestionDelete}
              selectedTest={selectedTest}
              setSelectedTest={setSelectedTest}
            />
          );
        case CustomQuestionsService.Matching:
          return (
            <Matching
              questionNode={questionNode}
              key={key}
              printView={2}
              questionNodeIndex={index}
              questionNodeIsEdit={questionNode.qtiModel.EditOption}
              onQuestionStateChange={handleQuestionState}
              onQuestionDelete={handleQuestionDelete}
              selectedTest={selectedTest}
              setSelectedTest={setSelectedTest}
            />
          );
        case CustomQuestionsService.FillInBlanks:
          return (
            <FillInBlanks
              questionNode={questionNode}
              key={key}
              printView={2}
              questionNodeIndex={index}
              questionNodeIsEdit={questionNode.qtiModel.EditOption}
              onQuestionStateChange={handleQuestionState}
              onQuestionDelete={handleQuestionDelete}
              selectedTest={selectedTest}
              setSelectedTest={setSelectedTest}
            />
          );
        case CustomQuestionsService.Essay:
          return (
            <Essay
              questionNode={questionNode}
              key={key}
              printView={2}
              questionNodeIndex={index}
              questionNodeIsEdit={questionNode.qtiModel.EditOption}
              onQuestionStateChange={handleQuestionState}
              onQuestionDelete={handleQuestionDelete}
              selectedTest={selectedTest}
              setSelectedTest={setSelectedTest}
            />
          );
        default:
          return null;
      }
    }
  };

  const DraggableQuestion = (question, index) => {
    const key = question.data.guid;
    const questionIndex = index;

    switch (question.data.quizType) {
      case CustomQuestionsService.MultipleChoice:
        return (
          <div key={key}>
            <MultipleChoice
              questionNode={question.data}
              questionNodeIndex={questionIndex}
              qtiModel={question.data.qtiModel}
              questionNodeIsEdit={question.data.qtiModel.EditOption}
              printView={2}
              onQuestionStateChange={handleQuestionState}
              onQuestionDelete={handleQuestionDelete}
            />
          </div>
        );
      case CustomQuestionsService.MultipleResponse:
        return (
          <div key={key}>
            <MultipleResponse
              questionNode={question.data}
              questionNodeIndex={questionIndex}
              qtiModel={question.data.qtiModel}
              questionNodeIsEdit={question.data.qtiModel.EditOption}
              printView={2}
              onQuestionStateChange={handleQuestionState}
              onQuestionDelete={handleQuestionDelete}
            />
          </div>
        );
      case CustomQuestionsService.TrueFalse:
        return (
          <div key={key}>
            <TrueFalse
              questionNode={question.data}
              questionNodeIndex={questionIndex}
              qtiModel={question.data.qtiModel}
              questionNodeIsEdit={question.data.qtiModel.EditOption}
              printView={2}
              onQuestionStateChange={handleQuestionState}
              onQuestionDelete={handleQuestionDelete}
            />
          </div>
        );
      case CustomQuestionsService.Matching:
        return (
          <div key={key}>
            <Matching
              questionNode={question.data}
              questionNodeIndex={questionIndex}
              qtiModel={question.data.qtiModel}
              questionNodeIsEdit={question.data.qtiModel.EditOption}
              printView={2}
              onQuestionStateChange={handleQuestionState}
              onQuestionDelete={handleQuestionDelete}
            />
          </div>
        );
      case CustomQuestionsService.FillInBlanks:
        return (
          <div key={key}>
            <FillInBlanks
              questionNode={question.data}
              questionNodeIndex={questionIndex}
              qtiModel={question.data.qtiModel}
              questionNodeIsEdit={question.data.qtiModel.EditOption}
              printView={2}
              onQuestionStateChange={handleQuestionState}
              onQuestionDelete={handleQuestionDelete}
            />
          </div>
        );
      case CustomQuestionsService.Essay:
        return (
          <div key={key}>
            <Essay
              questionNode={question.data}
              questionNodeIndex={questionIndex}
              qtiModel={question.data.qtiModel}
              questionNodeIsEdit={question.data.qtiModel.EditOption}
              printView={2}
              onQuestionStateChange={handleQuestionState}
              onQuestionDelete={handleQuestionDelete}
            />
          </div>
        );
      default:
        return null;
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
                className="rounded testNameInputBox"
                required={true}
              />
            </Form>
          </div>
        </div>
      </div>
      <div className="test-container">
        {selectedTest && selectedTest.questions && (
          <TreeViewTestCreate data={selectedTest.questions} renderQuestions={renderQuestions} />
        )}
        {selectedTest &&
          selectedTest.questions &&
          selectedTest.questions.map((question, index) => (
            <div key={question.guid}>{DraggableQuestion(question, index)}</div>
          ))}
      </div>
      <div ref={drop} className={`test-container ${canDrop && isOver && !isEditing ? 'drop-active' : ''}`}>
        <div>
          {selectedTest && selectedTest.questions && selectedTest.questions.length !== 0 ? (
            <div className="drag-container align-items-center d-flex justify-content-center">
              <FormattedMessage id="dragQuestionsHereTestcreate" />
            </div>
          ) : (
            <QuestionsBanksTips />
          )}
        </div>
      </div>
      {showDuplicateModal && (
        <Modal show={showDuplicateModal} onHide={handleHideDuplicateModal}>
          <Modal.Body>
            <FormattedMessage id="duplicateQuestionModal" />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleQuestion}>
              <FormattedMessage id="Ok" />
            </Button>
            <Button variant="secondary" onClick={handleHideDuplicateModal}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default TestCreate;
