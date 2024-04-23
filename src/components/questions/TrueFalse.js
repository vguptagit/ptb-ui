import { Link } from 'react-router-dom';
import { Collapse, Form } from 'react-bootstrap';
import { useState } from 'react';
import React from 'react';
import DOMPurify from 'dompurify';
import { FormattedMessage } from 'react-intl';
import CustomQuestionsService from '../../services/CustomQuestionsService';
import QtiService from '../../utils/qti-converter';

const TrueFalse = props => {
  const [open, setOpen] = useState(false);
  const questionNode = props.questionNode;
  const questionNodeIndex = props.questionNodeIndex;
  const initFormData = {
    Caption: questionNode.qtiModel ? questionNode.qtiModel.Caption : '',
    Options: questionNode.qtiModel ? questionNode.qtiModel.Options : ['', '', '', ''],
    CorrectAnswer: questionNode.qtiModel ? questionNode.qtiModel.CorrectAnswer : -1,
    Orientation: questionNode.qtiModel ? 'true' : 'false',
  };
  const [formData, setFormData] = useState(initFormData);

  const handleChange = e => {
    const { name, value } = e.target;
    console.log('name and value is ', name, value);
    setFormData({ ...formData, [name]: value });
  };

  const handleOptionsChange = e => {
    const { name, value } = e.target;
    //copying data to temp variable so that we do not directly mutate original state
    const tempOptions = [...formData.Options];
    //findIndex to find location of item we need to update
    tempOptions[name] = value;
    setFormData({ ...formData, Options: tempOptions });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (questionNode) {
      questionNode.qtiModel.Caption = formData.Caption;
      questionNode.qtiModel.Options = formData.Options;
      questionNode.qtiModel.CorrectAnswer = formData.CorrectAnswer;
      questionNode.qtiModel.Orientation = formData.Orientation;
      questionNode.qtiModel.EditOption = false;
      let jsonToXML = QtiService.getQtiXML(questionNode);
      questionNode.data = jsonToXML;
      const questionTemplates = CustomQuestionsService.questionTemplates(questionNode);

      let xmlToHtml = questionTemplates[0].textHTML;

      const testObj = { ...props.selectedTest }; // Create a copy of selectedTest

      // Find if any question in the array has the same itemId
      const existingQuestionIndex = testObj.questions.findIndex(q => q.itemId === questionNode.itemId);

      if (existingQuestionIndex !== -1) {
        // If the question already exists, update it
        testObj.questions[existingQuestionIndex] = {
          ...testObj.questions[existingQuestionIndex],
          spaceLine: formData.spaceLine || 0,
          textHTML: xmlToHtml,
        };
      } else {
        // If the question doesn't exist, add it to the end of the array
        testObj.questions.push({
          ...questionNode,
          spaceLine: formData.spaceLine || 0,
          textHTML: xmlToHtml,
        });
      }

      // Update the selected test with the modified questions array
      props.setSelectedTest(testObj);
    }
    props.onQuestionStateChange(false);
  };

  const handleEdit = e => {
    e.preventDefault();
    questionNode.qtiModel.EditOption = true;
    props.onQuestionStateChange(true);
  };

  const handleDelete = e => {
    e.preventDefault();
    if (questionNode.qtiModel.EditOption) {
      questionNode.qtiModel.EditOption = false;
      props.onQuestionDelete(questionNodeIndex);
      props.onQuestionStateChange(false);
    } else {
      props.onQuestionDelete(questionNodeIndex);
      props.onQuestionStateChange(false);
    }
  };

  const sanitizedData = data => ({
    __html: DOMPurify.sanitize(data),
  });

  const getEditView = () => {
    return (
      <div className="m-2">
        <Form className="editmode border rounded p-3 bg-light">
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <b>
              <Form.Label className="mb-1">{props.questionNode.qtiModel.QstnSectionTitle}</Form.Label>
            </b>
            <Form.Control
              name="Caption"
              onChange={handleChange}
              value={formData.Caption}
              className="mb-2"
              type="text"
              autoComplete="off"
            />
            <Form.Group className="mb-1 mt-3 d-flex flex-wrap">
              {formData?.Options?.length > 0 &&
                formData?.Options.map((optItem, index) => {
                  return (
                    <Form.Group key={index} className="mb-2 w-100 ">
                      <div className="d-flex align-items-center">
                        <Form.Check
                          type="radio"
                          checked={index == formData.CorrectAnswer}
                          value={index}
                          className="me-2"
                          name="CorrectAnswer"
                          onChange={handleChange}
                        />

                        <Form.Text style={{ fontSize: '1.1rem' }} className="mb-1 ">
                          {optItem}
                        </Form.Text>
                      </div>
                    </Form.Group>
                  );
                })}
            </Form.Group>
          </Form.Group>

          <div onClick={() => setOpen(!open)} className="d-flex align-items-center mb-3" style={{ cursor: 'pointer' }}>
            {open ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-right-fill"></i>}
            <span className="ms-2">
              <FormattedMessage id="formatMetadataTrueFalse" />
            </span>
          </div>

          <Collapse key={open ? 'open' : 'closed'} in={open}>
            <div className="metadata-container">
              <div className="mb-2">
                <span className="caption-metadata">
                  <FormattedMessage id="formatTrueFalse" />
                </span>
                <span className="normal-text">
                  <FormattedMessage id="visibleInPrintViewTrueFalse" />
                </span>
              </div>
              <div className="d-flex mc--orientation">
                <Form.Check
                  type="radio"
                  onChange={handleChange}
                  checked={'false' == formData.Orientation}
                  className="mr-5"
                  name="Orientation"
                  value="false"
                  label="Horizontal Display"
                />

                <Form.Check
                  type="radio"
                  onChange={handleChange}
                  checked={'true' == formData.Orientation}
                  className=""
                  name="Orientation"
                  value="true"
                  label="Vertical Display"
                />
              </div>
            </div>
          </Collapse>
          <div className="mb-1 d-flex justify-content-end">
            <Link
              className={`savelink ${!formData.Caption.trim() ? 'disabled-link' : ''}`}
              onClick={e => {
                if (!formData.Caption.trim()) {
                  e.preventDefault();
                  return;
                }
                handleSubmit(e);
              }}
            >
              <FormattedMessage id="viewTrueFalse" />
            </Link>
            <Link className="deletelink" onClick={handleDelete}>
              <FormattedMessage id="removeTrueFalse" />
            </Link>
          </div>
        </Form>
      </div>
    );
  };

  const getPrintOnlyView = () => {
    return (
      <div className="mb-3 d-flex align-items-center m-2 addfolder-container">
        <div className="flex-grow-1 d-flex align-items-center ml-7 d-flex align-items-center flex-wrap">
          <div className={formData.CorrectAnswer !== -1 ? 'w-100 ml-1' : 'w-100'}>
            <div className="mr-2">
              {questionNodeIndex + 1}){' '}
              <span className="view-content" dangerouslySetInnerHTML={sanitizedData(formData.Caption)}></span>
            </div>
          </div>
          <div className="w-100 mt-3">
            {formData.Options.map((value, index) => {
              return (
                <div key={index} className="view-question">
                  <div className="icon-section">
                    <span className="icon-ml"></span>
                  </div>
                  <div className="text-section">
                    <span className="ml-1">{String.fromCharCode(index + 'A'.charCodeAt(0))})</span>
                    <span className="ml-1 answer" dangerouslySetInnerHTML={sanitizedData(value)}></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const getPrintWithEditView = () => {
    return (
      <div className="mb-3 d-flex align-items-center m-2 addfolder-container">
        <div className="flex-grow-1 d-flex align-items-center ml-7 d-flex align-items-center flex-wrap">
          <div className={formData.CorrectAnswer !== -1 ? 'w-100 ml-1' : 'w-100'}>
            <div className="mr-2">
              {questionNodeIndex + 1}){' '}
              <span className="view-content" dangerouslySetInnerHTML={sanitizedData(formData.Caption)}></span>
            </div>
          </div>
          <div className="w-100 mt-3">
            {formData.Options.map((value, index) => {
              return (
                <div key={index} className="view-question">
                  <div className="icon-section">
                    {formData.CorrectAnswer == index ? (
                      <i className="bi bi-check" style={{ color: 'green' }}></i>
                    ) : (
                      <span className="icon-ml"></span>
                    )}
                  </div>
                  <div className={formData.CorrectAnswer == index ? 'text-section checked' : 'text-section'}>
                    <span className="ml-1">{String.fromCharCode(index + 'A'.charCodeAt(0))})</span>
                    <span className="ml-1 answer" dangerouslySetInnerHTML={sanitizedData(value)}></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex-grow-1 mr-7 d-flex align-items-center d-flex justify-content-end align-self-end">
          <button className="editbtn" onClick={handleEdit}>
            <i className="bi bi-pencil-fill"></i>
          </button>
          <button className="deletebtn" onClick={handleDelete}>
            <i className="bi bi-trash"></i>
          </button>
        </div>
      </div>
    );
  };

  const getPrintWithAnswerView = () => {
    return (
      <div className="mb-3 d-flex align-items-center m-2 addfolder-container">
        <div className="flex-grow-1 d-flex align-items-center ml-7 d-flex align-items-center flex-wrap">
          <div className={formData.CorrectAnswer !== -1 ? 'w-100 ml-1' : 'w-100'}>
            <div className="mr-2">
              {questionNodeIndex + 1}){' '}
              <span className="view-content" dangerouslySetInnerHTML={sanitizedData(formData.Caption)}></span>
            </div>
          </div>
          <div className="w-100 mt-3">
            {formData.Options.map((value, index) => {
              return (
                <div key={index} className="view-question">
                  <div className="icon-section">
                    {formData.CorrectAnswer == index ? (
                      <i className="bi bi-check" style={{ color: 'green' }}></i>
                    ) : (
                      <span className="icon-ml"></span>
                    )}
                  </div>
                  <div className={formData.CorrectAnswer == index ? 'text-section checked' : 'text-section'}>
                    <span className="ml-1">{String.fromCharCode(index + 'A'.charCodeAt(0))})</span>
                    <span className="ml-1 answer" dangerouslySetInnerHTML={sanitizedData(value)}></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const getPrintView = viewId => {
    if (viewId == 3) {
      return getPrintWithAnswerView();
    } else if (viewId == 2) {
      return getPrintWithEditView();
    } else {
      return getPrintOnlyView();
    }
  };

  return (
    <div id={questionNode.itemId}>
      {!questionNode.qtiModel.EditOption ? getPrintView(props.printView) : getEditView()}
    </div>
  );
};
export default TrueFalse;
