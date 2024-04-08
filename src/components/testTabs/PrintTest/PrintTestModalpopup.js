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
import { FormattedMessage } from "react-intl";

function PrintTestModalpopup({ show, handleCloseModal }) {
  const printableContentRef = useRef();
  const [count, setCount] = useState(1);
  const [isChecked, setIsChecked] = useState("none");
  const { selectedTest, setSelectedTest } = useAppContext();
  const [addStudentName, setAddStudentName] = useState(false);

  useEffect(() => {
    if (selectedTest?.questions) {
      setSelectedTest({ ...selectedTest, questions: selectedTest?.questions });
    }
  }, [selectedTest?.questions]);


  const handleDecreaseLine = () => {
    if (count >= 1 && count <= selectedTest?.questions?.length) {
      const updatedQuestions = [...selectedTest?.questions];
      updatedQuestions[count - 1] = {
        ...updatedQuestions[count - 1],
        spaceLine: Math.max(0, updatedQuestions[count - 1].spaceLine - 1),
      };
      setSelectedTest({ ...selectedTest, questions: updatedQuestions });
    }
  };

  const handleAddLine = () => {
    if (count >= 1 && count <= selectedTest?.questions?.length) {
      const updatedQuestions = [...selectedTest?.questions];
      updatedQuestions[count - 1] = {
        ...updatedQuestions[count - 1],
        spaceLine: updatedQuestions[count - 1].spaceLine + 1,
      };
      setSelectedTest({ ...selectedTest, questions: updatedQuestions });
    }
  };

  const handleAddBlankPage = () => {
    if (count >= 1 && count <= selectedTest?.questions.length) {
      const updatedQuestions = [...selectedTest?.questions];
      updatedQuestions[count - 1] = {
        ...updatedQuestions[count - 1],
        spaceLine: 34,
      };
      setSelectedTest({ ...selectedTest, questions: updatedQuestions });
    }
  };

  const handleRemoveBlankPage = () => {
    const updatedQuestions = selectedTest?.questions.map(question => ({
      ...question,
      spaceLine: 0
    }));
  
    setSelectedTest({ ...selectedTest, questions: updatedQuestions });
  };

  const handleBlankLastPage = (e) => {
    var updatedQuestions = selectedTest?.questions.map(question => ({
      ...question,
      spaceLine: 0
    }));
    selectedTest.questions = [...updatedQuestions];
    const isChecked = e.target.checked;
    updatedQuestions = [...selectedTest?.questions];
    updatedQuestions[selectedTest?.questions.length - 1] = {
      ...updatedQuestions[selectedTest?.questions.length - 1],
      spaceLine: isChecked ? 34 : 0,
    };
    setSelectedTest({ ...selectedTest, questions: updatedQuestions });
  };


  return (
    <Modal
      show={show}
      onHide={handleCloseModal}
      className="custom-modal"
      size="xl"
      centered
      style={{ maxHeight: "100vh" }}
    >
      <div className="modal-content">
        <Row>
          <Col md={6}>
            <div className="print-options">
              <Modal.Header className="printoptions-header">
                <Modal.Title>
                  <h3><FormattedMessage id="printoption" /></h3>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="print-options-body">
                <Row>
                  <Col md={6}>
                    <div><FormattedMessage id="studentanswerarea" /></div>
                  </Col>
                  <Col md={6}>
                    <div>
                    <input
                      checked={isChecked == "none" && true}
                      onClick={(e) => {setIsChecked(e.target.name);
                          handleRemoveBlankPage(e)
                          }}
                      name="none"
                      type="radio"
                    />
                      <span className="ms-1 mt-2"><FormattedMessage id="radionone" /></span>
                    </div>
                    <div>
                      <input
                        checked={isChecked == "spaceBetween" && true}
                        onClick={(e) => setIsChecked(e.target.name)}
                        name="spaceBetween"
                        type="radio"
                      />
                      <span className="ms-1 mt-2"><FormattedMessage id="betweenquestions" /></span>
                      {isChecked == "spaceBetween" && (
                        <div>
                          <div className="question-no d-flex flex-wrap mb-2">
                          <FormattedMessage id="enterquestionno" />
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
                              <FormattedMessage id="addline" />
                            </Button>
                            <Button size="sm" onClick={handleDecreaseLine}>
                              <FormattedMessage id="removeline" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                    <input
                      checked={isChecked == "leftSide" && true}
                      onClick={(e) => {setIsChecked(e.target.name);
                          handleRemoveBlankPage()
                          }}
                      //onClick={(e) => handleLeftSidePage(e)}
                      name="leftSide"
                      type="radio"
                    />
                      <span className="ms-1 mt-2"><FormattedMessage id="leftsidepage" /></span>
                    </div>
                    <div>
                    <input
                      checked={isChecked == "blankPage" && true}
                      onClick={(e) => {
                          setIsChecked(e.target.name);
                          handleBlankLastPage(e);
                      }}
                      name="blankPage"
                      type="radio"
                    />
                      <span className="ms-1 mt-2"><FormattedMessage id="blanklastpage" /></span>
                    </div>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col md={6}>
                  <div>
                    <FormattedMessage id="labelsPrintMessage" />
                  </div>
                  </Col>
                  <Col md={6}>
                    <input
                      type="checkbox"
                      onClick={(e) => setAddStudentName(e.target.checked)}
                    />
                    <span className="ms-1 mt-2">
                      <FormattedMessage id="studentnamelabel" />
                    </span>
                  </Col>
                  <div className="mt-4 d-flex align-items-center">
                    <i className="bi bi-info-circle-fill large-icon me-1" id="info-icon"></i>
                    <span className="TextFormat text-muted">
                      <FormattedMessage id="exportbuttoninfo" />
                    </span>
                  </div>
                </Row>
              </Modal.Body>
              <Modal.Footer className="button-footer">
                <Button variant="secondary" onClick={handleCloseModal}>
                  <FormattedMessage id="print.popup.cancel" />
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
            <div className="print-preview" id="printPreviewArea">
              <Modal.Header className="printpreview-header" closeButton>
                <Modal.Title>
                  <h3><FormattedMessage id="print.preview" /></h3>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="questions-list">
              <div className="test-containers" id="print-test">
                  {selectedTest?.questions && (
                    <div className="print-tree-view-container">
                      <PrintTestTreeView
                        savedQuestions={selectedTest?.questions}
                        ref={printableContentRef}
                        addStudentName={addStudentName}
                        isChecked={isChecked}
                        setIsChecked={setIsChecked}
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