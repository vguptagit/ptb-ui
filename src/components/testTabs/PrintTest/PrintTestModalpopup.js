import React, { useRef, useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import "./PrintTestModalpopup.css"; // Import CSS file for styling
import PrintTestTreeView from "./PrintTestTreeView";
import QtiService from "../../../utils/qtiService";
import { useAppContext } from "../../../context/AppContext";
import CustomQuestionBanksService from "../../../services/CustomQuestionBanksService";
import MultipleChoice from "../../questions/MultipleChoice";
import MultipleResponse from "../../questions/MultipleResponse";
import TrueFalse from "../../questions/TrueFalse";
import Matching from "../../questions/Matching";
import FillInBlanks from "../../questions/FillInBlanks";
import Essay from "../../questions/Essay";
import Toastify from "../../common/Toastify";
import ReactToPrint from "react-to-print";

function PrintTestModalpopup({ show, handleClosePrintModal }) {
  console.log("show", show);
  const printableContentRef = useRef();
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
            isPrint={true}
          />
        );
      case CustomQuestionBanksService.MultipleResponse:
        return (
          <MultipleResponse
            questionNode={questionNode}
            questionNodeIndex={index}
            isPrint={true}
          />
        );
      case CustomQuestionBanksService.TrueFalse:
        return (
          <TrueFalse questionNode={questionNode} questionNodeIndex={index} isPrint={true}/>
        );
      case CustomQuestionBanksService.Matching:
        return (
          <Matching questionNode={questionNode} questionNodeIndex={index} isPrint={true} />
        );
      case CustomQuestionBanksService.FillInBlanks:
        return (
          <FillInBlanks questionNode={questionNode} questionNodeIndex={index} isPrint={true} />
        );
      case CustomQuestionBanksService.Essay:
        return <Essay questionNode={questionNode} questionNodeIndex={index} isPrint={true}/>;
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
      style={{ maxHeight: "100vh" }}
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
                          <div className="question-no d-flex flex-wrap mb-2">
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
                          <div className="add-remove-buttons d-flex gap-1 flex-wrap">
                            <Button size="sm" onClick={handleAddLine}>
                              Add line
                            </Button>
                            <Button size="sm" onClick={handleDecreaseLine}>
                              Remove line
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        checked={isChecked == "leftSide" && true}
                        onClick={(e) => setIsChecked(e.target.name)}
                        //onClick={(e) => handleLeftSidePage(e)}
                        name="leftSide"
                        type="radio"
                      />
                      <span className="ms-1 mt-2">Left side of the page</span>
                    </div>
                    <div>
                      <input
                        checked={isChecked == "blankPage" && true}
                        onClick={(e) => setIsChecked(e.target.name)}
                        //onClick={(e) => handleBlankLastPage(e)}
                        name="blankPage"
                        type="radio"
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
                  <div className="mt-4 d-flex align-items-center">
                    <i className="bi bi-info-circle-fill large-icon me-1"></i>
                    <span className="TextFormat text-muted">
                      For more total format options, cancel print, and select
                      the export button
                    </span>
                  </div>
                </Row>
              </Modal.Body>
              <Modal.Footer className="button-footer">
                <Button variant="secondary" onClick={handleClosePrintModal}>
                  Cancel
                </Button>
                <ReactToPrint
                  trigger={() => <Button variant="primary">Print</Button>}
                  content={() => printableContentRef.current}
                  removeAfterPrint
                />
              </Modal.Footer>
            </div>
          </Col>
          <Col md={6}>
            <div className="print-preview">
              <Modal.Header>
                <Modal.Title>
                  <h3>Print Preview</h3>
                </Modal.Title>
                <button className="closebutton" onClick={handleClosePrintModal}>
                  <i class="bi bi-x"></i>
                </button>
              </Modal.Header>
              <Modal.Body className="questions-list">
                <div className="test-containers">
                  {savedQuestions && (
                    <div className="print-tree-view-container">
                      <PrintTestTreeView
                        data={savedQuestions}
                        ref={printableContentRef}
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
  );
}

export default PrintTestModalpopup;
