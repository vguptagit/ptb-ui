import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useDrop } from "react-dnd";
import { FormattedMessage } from "react-intl";
import { Form } from "react-bootstrap";
import "./TestCreate.css";
import QuestionBanksTips from "./testTabs/QuestionsBanksTips/QuestionsBanksTips";
import Essay from "./questions/Essay";
import CustomQuestionBanksService from "../services/CustomQuestionBanksService";
import QtiService from '../utils/qtiService';

const TestCreate = () => {
  const { selectedTest } = useAppContext();
  const [droppedNode, setDroppedNode] = useState(null);
  const [childEditMode, setChildEditMode] = useState(false);
  const [questionListSize, setQuestionListSize] = useState(0);

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: "TREE_NODE",
    drop: (item) => {
      console.log("Dropped node:", item.node);
      let questions = selectedTest.questions;
      // TODO : Update the logic to handle different types of Question
      if(questions) {
          questions.push(getQuestion('Essay'));
      } else {
          questions = [];
          questions.push(getQuestion('Essay'));
          selectedTest.questions = questions;
      }
      setDroppedNode(item.node);
      setChildEditMode(true); // Always set mode edit for the node dropped
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const getQuestion = (questionType) => {
      // Update logic to check type of question & return object accordingly
      let question = {}
      if(questionType === 'Essay') {
        const essayTemplate = CustomQuestionBanksService.Essay_Template;
        var qtiModel = QtiService.getQtiModel(essayTemplate,'Essay');
        qtiModel.EditOption = true;
        question.qtiModel = qtiModel;
      }     
      return question;
  }

  useEffect(() => {
    console.log("TestCreate useEffect", selectedTest);
  }, [selectedTest]);


  // Mode of question in the child object
  const handleQuestionState = (edit) => {
        setChildEditMode(edit);
  }

  // Remove the item from question List
  const handleQuestionDelete = (deleteIndex) => {
      if(deleteIndex > -1) {
            selectedTest.questions.splice(deleteIndex,1);
            setQuestionListSize(selectedTest.questions.length+1); // This is required to refresh state
        }
  }

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
                    placeholder="Enter Title"
                    value={selectedTest.title}
                    className="rounded"
                    />
                </div>
            </div>
        </div>
        <div className="test-container">
            { selectedTest.questions  ?  
            (selectedTest.questions.map((questionNode,index)=>{
                return <Essay questionNode={questionNode} key={Date.now() + '_' + selectedTest.id + questionListSize + '_' + index} questionNodeIndex={index} questionNodeIsEdit={questionNode.qtiModel.EditOption} onQuestionStateChange={handleQuestionState}  onQuestionDelete={handleQuestionDelete}/>
            })) : ''}
        </div>
        <div ref={drop} className={`test-container ${canDrop && isOver && !childEditMode ? "drop-active" : ""}`}>
            <div>
                {selectedTest.questions && selectedTest.questions.length != 0 ? <div className="drag-container align-items-center d-flex justify-content-center">Drag Questions Here </div> : <QuestionBanksTips />}
                
            </div>
        </div>
    </div>
  );
};

export default TestCreate;
