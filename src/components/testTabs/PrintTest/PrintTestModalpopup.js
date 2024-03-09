import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import './PrintTestModalpopup.css'; // Import CSS file for styling
import PrintTestTreeView from './PrintTestTreeView';
import QtiService from "../../../utils/qtiService";
import { useAppContext } from "../../../context/AppContext";
import CustomQuestionBanksService from "../../../services/CustomQuestionBanksService";
import Essay from "../../questions/Essay";
import FillInBlanks from "../../questions/Essay";
import Matching from "../../questions/Matching";
import MultipleChoice from "../../questions/MultipleChoice";
import MultipleResponse from "../../questions/MultipleResponse";
import TrueFalse from "../../questions/TrueFalse";
import Toastify from '../../common/Toastify';

function PrintTestModalpopup({ show, handleClosePrintModal }) {
  console.log("show", show);
  const [count, setCount] = useState(1);
  const [isChecked, setIsChecked] = useState("none");
  const { selectedTest } = useAppContext();
  const [savedQuestions, setSavedQuestions] = useState(null);

  useEffect(() => {
    if (selectedTest?.questions) {
      setSavedQuestions(selectedTest?.questions);
    }
  }, [selectedTest?.questions]);

  console.log(savedQuestions);

  const handleDecreaseLine = () => {
    if (count >= 1 && count <= savedQuestions?.length) {
      const updatedQuestions = [...savedQuestions];
      updatedQuestions[count - 1] = {
        ...updatedQuestions[count - 1],
        spaceLine: Math.max(0, updatedQuestions[count - 1].spaceLine - 1),
      };
      setSavedQuestions(updatedQuestions);
    }
  };

  const handleAddLine = () => {
    if (count >= 1 && count <= savedQuestions?.length) {
      const updatedQuestions = [...savedQuestions];
      updatedQuestions[count - 1] = {
        ...updatedQuestions[count - 1],
        spaceLine: updatedQuestions[count - 1].spaceLine + 1,
      };
      setSavedQuestions(updatedQuestions);
      Toastify({ message: "1 line added", type: "Info" });
    }
  };

  const handleAddBlankPage = () => {
    if (count >= 1 && count <= savedQuestions.length) {
      const updatedQuestions = [...savedQuestions];
      updatedQuestions[count - 1] = {
        ...updatedQuestions[count - 1],
        spaceLine: 34,
      };
      setSavedQuestions(updatedQuestions);
    }
  };

  const handleRemoveBlankPage = () => {
    if (count >= 1 && count <= savedQuestions.length) {
      const updatedQuestions = [...savedQuestions];
      updatedQuestions[count - 1] = {
        ...updatedQuestions[count - 1],
        spaceLine: 0,
      };
      setSavedQuestions(updatedQuestions);
    }
  };

  const handleBlankLastPage = (e) => {
    const isChecked = e.target.checked;
    const updatedQuestions = [...savedQuestions];
    updatedQuestions[savedQuestions.length - 1] = {
      ...updatedQuestions[savedQuestions.length - 1],
      spaceLine: isChecked ? 34 : 0,
    };
    setSavedQuestions(updatedQuestions);
    Toastify({
      message: isChecked ? "blank page added" : "blank page removed",
      type: isChecked ? "Info" : "error",
    });
  };

  const renderQuestions = (questionNode, index) => {
    const key = questionNode.itemId;
    switch (questionNode.quizType) {
      case CustomQuestionBanksService.MultipleChoice:
        return (
          <MultipleChoice
            questionNode={questionNode}
            questionNodeIndex={index}
          />
        );
      case CustomQuestionBanksService.MultipleResponse:
        return (
          <MultipleResponse
            questionNode={questionNode}
            questionNodeIndex={index}
          />
        );
      case CustomQuestionBanksService.TrueFalse:
        return (
          <TrueFalse
            questionNode={questionNode}
            questionNodeIndex={index}
          />
        );
      case CustomQuestionBanksService.Matching:
        return (
          <Matching
            questionNode={questionNode}
            questionNodeIndex={index}
          />
        );
      case CustomQuestionBanksService.FillInBlanks:
        return (
          <FillInBlanks
            questionNode={questionNode}
            questionNodeIndex={index}
          />
        );
      case CustomQuestionBanksService.Essay:
        return (
          <Essay
            questionNode={questionNode}
            questionNodeIndex={index}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal 
      show={show}
      handleClosePrintModal={handleClosePrintModal}
      className="custom-modal"
      size="xl"
      centered
      style={{ maxHeight: '100vh' }}
    >
      <div className="modal-content">
        <Row>
          <Col md={6}>
            <div className="print-options">
              <Modal.Header>
                <Modal.Title>
                  <h3>Print Options</h3>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <Row>
                <Col md={4}>
                  <div>Student answer area</div>
                </Col>
                <Col md={8}>
                  <div>
                    <input
                      checked={isChecked == "none" && true}
                      onClick={(e) => setIsChecked(e.target.name)}
                      name="none"
                      type="radio"
                    />
                    <span className="ms-1 mt-2">None</span>
                  </div>
                  <div>
                    <input
                      checked={isChecked == "spaceBetween" && true}
                      onClick={(e) => setIsChecked(e.target.name)}
                      name="spaceBetween"
                      type="radio"
                    />
                    <span className="ms-1 mt-2">Between Questions</span>
                    {isChecked == "spaceBetween" && (
                      <div>
                        <div className="d-flex flex-wrap mb-2">
                          Enter Question no:
                          <Form.Control
                            style={{ width: "80px" }}
                            className="ms-2"
                            type="number"
                            onChange={(e) => setCount(e.target.value)}
                            value={count}
                            min={1}
                            max={selectedTest?.questions.length}
                          />
                        </div>
                        <div className="d-flex gap-1 flex-wrap justify-content-center">
                          <Button size="sm" onClick={handleDecreaseLine}>
                            Remove line
                          </Button>
                          <Button size="sm" onClick={handleAddLine}>
                            Add line
                          </Button>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={handleAddBlankPage}
                          >
                            Add blank page
                          </Button>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={handleRemoveBlankPage}
                          >
                            Remove all line
                          </Button>
                         </div>
                      </div>
                    )}
                  </div>
                  <div>      
                    <input
                      type="radio"
                      // onClick={(e) => handleLeftSidePage(e)}
                    />
                    <span className="ms-1 mt-2">Left side of the page</span>
                  </div>
                  <div>      
                    <input
                      type="radio"
                      onClick={(e) => handleBlankLastPage(e)}
                    />
                    <span className="ms-1 mt-2">Blank last page</span>
                  </div>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md={4}>
                  <div>Labels</div>
                </Col>
                <Col md={8}>
                  <input
                    type="checkbox"
                    // onClick={(e) => setAddStudentName(e.target.checked)}
                  />
                  <span className="ms-1 mt-2">
                    Add student name label and space
                  </span>
                </Col>
              </Row>
              </Modal.Body>
              <Modal.Footer className='button-footer'>
                <Button variant="secondary" onClick={handleClosePrintModal}>
                  Cancel
                </Button>
                <Button variant='primary'> Print </Button>
              </Modal.Footer>
            </div>
          </Col>
          <Col md={6}>
            <div className="print-preview">
              <Modal.Header closeButton>
                <Modal.Title>
                  <h3>Print Preview</h3>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className='questions-list'>
              <div className="test-containers">
                <div>With and Without metadata - {savedQuestions?.length} Questions</div>
                {savedQuestions && (
                  <div className="print-tree-view-container">
                  <PrintTestTreeView
                    data={savedQuestions}
                    renderQuestions={renderQuestions}
                  />
                </div>
                )}
              </div>
              </Modal.Body>
            </div>
          </Col>
        </Row>
      </div>
    </Modal>
  )
}

export default PrintTestModalpopup
