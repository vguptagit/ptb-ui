import { Link } from "react-router-dom";
import { Collapse, Form } from "react-bootstrap";
import { useState } from "react";
import React from 'react';
import DOMPurify from 'dompurify'
const MultipleChoice = (props) => {
    const [open, setOpen] = useState(false);
    const questionNode = props.questionNode;
    const questionNodeIndex = props.questionNodeIndex;
    const initFormData = {
        Caption: questionNode.qtiModel ? questionNode.qtiModel.Caption : "",
        Options: questionNode.qtiModel ? questionNode.qtiModel.Options : ["","","",""],
        CorrectAnswer: questionNode.qtiModel ? questionNode.qtiModel.CorrectAnswer : -1,
        Orientation: questionNode.qtiModel ? "true" : "false"
    };
    const [formData, setFormData] = useState(initFormData);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleOptionsChange = (e) =>{
        const { name, value } = e.target; 
        //copying data to temp variable so that we do not directly mutate original state
        const tempOptions = [...formData.Options];
        //findIndex to find location of item we need to update
        tempOptions[name] = value;        
        setFormData({ ...formData, Options: tempOptions })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(questionNode) {
            questionNode.qtiModel.Caption = formData.Caption;
            questionNode.qtiModel.Options = formData.Options;
            questionNode.qtiModel.CorrectAnswer = formData.CorrectAnswer;
            questionNode.qtiModel.Orientation = formData.Orientation;
            questionNode.qtiModel.EditOption = false;
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

    const sanitizedData = (data) => ({
        __html: DOMPurify.sanitize(data)
      })


return (
<div id={questionNode.itemId}>
{!questionNode.qtiModel.EditOption ? (
    <div className="mb-3 d-flex align-items-center m-2 addfolder-container">
      <div className="flex-grow-1 d-flex align-items-center ml-7 d-flex align-items-center flex-wrap">
            <div className={formData.CorrectAnswer !== -1 ? "w-100 ml-1" : "w-100"}> 
            <div className="mr-2">{questionNodeIndex + 1}) <span dangerouslySetInnerHTML={sanitizedData(formData.Caption)}></span></div>            </div>
            
            <div className="w-100 mt-3">
            {
                formData.Options.map((value,index) => {
                    return (
                    <div className="view-question">
                        <div className="icon-section">
                        {formData.CorrectAnswer == index ? 
                                <i className="bi bi-check" style={{ color: "green"}}></i>
                                        : <span className="icon-ml"></span>} 
                        </div>
                        <div className= {formData.CorrectAnswer == index ? "text-section checked" : "text-section"}>
                            <span className="ml-1">{String.fromCharCode(index + 'A'.charCodeAt(0))})</span> 
                            <span className="ml-1 answer" dangerouslySetInnerHTML={sanitizedData(value)}></span>                        </div>
                    </div>);
                })
            }
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
  ) : (
<Form className="editmode border rounded p-3 bg-light">
  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
    <Form.Label className="mb-1">{props.questionNode.qtiModel.QstnSectionTitle}</Form.Label>
    <Form.Control
      name="Caption"
      onChange={handleChange}
      value={formData.Caption}
      className="mb-2"
      type="text"
      autoComplete="off"
      placeholder={props.questionNode.qtiModel.EditCaption}
    />
    <Form.Group className="mb-1 mt-3 d-flex flex-wrap">
        {formData?.Options?.length > 0 &&
            formData?.Options.map((optItem, index) => {
            return (
            <Form.Group key={index} className="mc-flex-row mb-2">
                    <div className="mc-col mc-col-1">
                        <Form.Check
                            type="radio"
                            checked={index == formData.CorrectAnswer}
                            value={index}
                            name="CorrectAnswer"
                            className="item-1"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mc-col mc-col-2">
                        <Form.Control
                            onChange={handleOptionsChange}
                            value={optItem}
                            name={index}
                            className="item-2"
                            type="text"
                            placeholder="Enter Answer"
                        />
                    </div>
            </Form.Group>
            );
        })}
      </Form.Group>
  </Form.Group>
  <div onClick={() => setOpen(!open)} className="d-flex align-items-center mb-3" style={{ cursor: "pointer" }}>
              {open ? (
                <i className="bi bi-caret-down-fill"></i>
              ) : (
                <i className="bi bi-caret-right-fill"></i>
              )}
              <span className="ms-2">Format and add metadata</span>
   </div>
   <Collapse key={open ? "open" : "closed"} in={open}>        
      <div className="metadata-container">
        <div className="mb-2">
			<span className="caption-metadata">Format</span><span className="normal-text"> (visible in Print View) </span>
		</div>  
        <div className="d-flex mc--orientation">
            <Form.Check
                type="radio"
                onChange={handleChange}
                checked={"false" == formData.Orientation}
                className="mr-5"
                name="Orientation"
                value="false"
                label="Horizontal Display"
            />
            
            <Form.Check
                type="radio"
                onChange={handleChange}
                checked={"true" == formData.Orientation}
                className=""
                name="Orientation"
                value="true"
                label="Vertical Display"
            />
        </div>
      </div>
 </Collapse>
  <div className="mb-1 d-flex justify-content-end">
    <Link className={`savelink ${!formData.Caption.trim() ? 'disabled-link' : ''}`} onClick={handleSubmit} tabIndex={!formData.Caption.trim() ? -1 : 0}>
      Save
    </Link>
    <Link className="deletelink" onClick={handleDelete}>
      Remove
    </Link>
  </div>
</Form>
  )}
  </div>
);
}
export default MultipleChoice;