import { Link } from "react-router-dom";
import { Collapse, Form } from "react-bootstrap";
import { useState } from "react";
import DOMPurify from 'dompurify'
import { FormattedMessage } from 'react-intl';
import CustomQuestionBanksService from "../../services/CustomQuestionBanksService";
import QtiService from "../../utils/qtiService";

const Essay = (props) => {
  const [open, setOpen] = useState(false);
  const questionNode = props.questionNode;
  const questionNodeIndex = props.questionNodeIndex;
  const initFormData = {
    question: questionNode.qtiModel ? questionNode.qtiModel.Caption : "",
    answer: questionNode.qtiModel ? questionNode.qtiModel.RecommendedAnswer : "",
    essayQuestionSize: questionNode.qtiModel ? questionNode.qtiModel.EssayPageSize : "",
  };
  const [formData, setFormData] = useState(initFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (questionNode && props.selectedTest.questions.length > 0) {
      questionNode.qtiModel.Caption = formData.question;
      questionNode.qtiModel.RecommendedAnswer = formData.answer;
      questionNode.qtiModel.EssayPageSize = formData.essayQuestionSize;
      questionNode.qtiModel.EditOption = false;
      let jsonToXML = QtiService.getQtiXML(questionNode);
      questionNode.data = jsonToXML;
      const questionTemplates = CustomQuestionBanksService.questionTemplates(questionNode);

      let xmlToHtml = questionTemplates[0].textHTML;
    
            const testObj = { ...props.selectedTest }; // Create a copy of selectedTest
    
            // Find if any question in the array has the same itemId
            const existingQuestionIndex = testObj.questions.findIndex(
                (q) => q.itemId === questionNode.itemId
            );
    
            if (existingQuestionIndex !== -1) {
                // If the question already exists, update it
                testObj.questions[existingQuestionIndex] = {
                    ...testObj.questions[existingQuestionIndex],
                    spaceLine: formData.spaceLine || 0,
                    textHTML: xmlToHtml
                };
            } else {
                // If the question doesn't exist, add it to the end of the array
                testObj.questions.push({
                    ...questionNode,
                    spaceLine: formData.spaceLine || 0,
                    textHTML: xmlToHtml
                });
            }
    
            // Update the selected test with the modified questions array
            props.setSelectedTest(testObj);
    }
    props.onQuestionStateChange(false);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    questionNode.qtiModel.EditOption = true;
    props.onQuestionStateChange(true);
  };

  const handleDelete = (e) => {
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

  const handleEssayQuestionSizeChange = (value) => {
    let essayQuestionSize = "essayQuestionSize";
    setFormData({ ...formData, [essayQuestionSize]: value });
  };

  const sanitizedData = (data) => ({
    __html: DOMPurify.sanitize(data)
  })

  return (
    <div id={questionNode.itemId}>
      {!questionNode.qtiModel.EditOption ? (
        <div className="mb-1 d-flex align-items-center m-2 addfolder-container">
          <div className="flex-grow-1 d-flex ml-7 d-flex">
            <div className="mr-2">{questionNodeIndex + 1})</div>
            <div className="view-content" dangerouslySetInnerHTML={sanitizedData(formData.question)}></div>
          </div>
          {!props.isPrint ? (
              <div className="flex-grow-1 mr-7 d-flex align-items-center d-flex justify-content-end align-self-end">
              <button className="editbtn" onClick={handleEdit}>
                  <i className="bi bi-pencil-fill"></i>
              </button>
              <button className="deletebtn" onClick={handleDelete}>
                  <i className="bi bi-trash"></i>
              </button>
          </div>
          ) : ('')}
        </div>
      ) : (
        <div className="m-2">
          <Form onSubmit={handleSubmit} className="editmode border rounded p-3 bg-light">
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label className="mb-1"><b>{questionNode.qtiModel.QstnSectionTitle}</b></Form.Label>
              <Form.Control
                type="text"
                name="question"
                value={formData.question}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label className="mb-1"><b>{questionNode.qtiModel.EditRecommendedAnswer}</b></Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="answer"
                value={formData.answer}
                onChange={handleChange}
              />
            </Form.Group>
            <div onClick={() => setOpen(!open)} className="d-flex align-items-center mb-3" style={{ cursor: "pointer" }}>
              {open ? (
                <i className="bi bi-caret-down-fill"></i>
              ) : (
                <i className="bi bi-caret-right-fill"></i>
              )}
            <span className="ms-2">
                <b><FormattedMessage id="formatAndAddMetadataEssay" defaultMessage="Format and add metadata" /></b>
            </span>
            </div>
            <Collapse key={open ? "open" : "closed"} in={open}>
              <div id="example-collapse-text" className={`d-flex gap-2 ${open ? "visible" : "invisible"}`}>
              <label htmlFor="option1">
                    <FormattedMessage id="essaySpaceLabel" defaultMessage="Essay Space:" />
                  </label>
                  <input
                    type="radio"
                    id="option1"
                    name="options"
                    value="0"
                    checked={0 == formData.essayQuestionSize}
                    onChange={(e) => handleEssayQuestionSizeChange(e.target.value)}
                  />
                  <label htmlFor="option1">
                    <FormattedMessage id="noneOption" defaultMessage="None" />
                  </label>
                  <input
                    type="radio"
                    id="option2"
                    name="options"
                    value="10"
                    checked={10 == formData.essayQuestionSize}
                    onChange={(e) => handleEssayQuestionSizeChange(e.target.value)}
                  />
                  <label htmlFor="option2">
                    <FormattedMessage id="quarterPageOption" defaultMessage="1/4 page" />
                  </label>
                  <input
                    type="radio"
                    id="option3"
                    name="options"
                    value="20"
                    checked={20 == formData.essayQuestionSize}
                    onChange={(e) => handleEssayQuestionSizeChange(e.target.value)}
                  />
                  <label htmlFor="option3">
                    <FormattedMessage id="halfPageOption" defaultMessage="1/2 page" />
                  </label>
                  <input
                    type="radio"
                    id="option4"
                    name="options"
                    value="40"
                    checked={40 == formData.essayQuestionSize}
                    onChange={(e) => handleEssayQuestionSizeChange(e.target.value)}
                  />
                  <label htmlFor="option4">
                    <FormattedMessage id="fullPageOption" defaultMessage="1 page" />
                  </label>
                </div>
            </Collapse>
            <div className="mb-1 d-flex justify-content-end">
              <Link className="savelink" onClick={handleSubmit}>
                  <FormattedMessage id="view" />
              </Link>
              <Link className="deletelink" onClick={handleDelete}>
                  <FormattedMessage id="delete" />
              </Link>
          </div>
          </Form>
        </div>
      )}
    </div>
  );
};
export default Essay;
