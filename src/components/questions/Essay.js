import { Link } from "react-router-dom";
import { Collapse, Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";

const Essay = (props) => {
    const [open, setOpen] = useState(false);
    const questionNode = props.questionNode;
    const questionNodeIndex = props.questionNodeIndex;
    const questionNodeIsEdit = props.questionNodeIsEdit;
    const initFormData = {
        question:questionNode.qtiModel ? questionNode.qtiModel.Caption : '', 
        answer: questionNode.qtiModel ? questionNode.qtiModel.RecommendedAnswer : '',
        essayQuestionSize: questionNode.qtiModel ? questionNode.qtiModel.EssayPageSize : ''};
    const [formData, setFormData] = useState(initFormData);   // State to hold form data 
    const [editMode, setEditMode] = useState(questionNodeIsEdit); // State to hold mode

    // Update form data state as & when user enters the form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submit. Copy the form data to question Node & propogate mode change to parent
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submit -- Form Data:', formData);      
        questionNode.qtiModel.Caption = formData.question;
        questionNode.qtiModel.RecommendedAnswer = formData.answer;
        questionNode.qtiModel.EssayPageSize = formData.essayQuestionSize;
        questionNode.qtiModel.EditOption = false;
        setEditMode(false);
        props.onQuestionStateChange(false);
      };

    // On Edit - set the mode to edit & propogate state change to parent
    const handleEdit = (e) => {
        e.preventDefault();
        questionNode.qtiModel.EditOption = true;
        setEditMode(true);
        props.onQuestionStateChange(true);
      }

    // On Delete - Delegate call to parent to remove question from list & propogate state change
    const handleDelete = (e) => {
        e.preventDefault();
        props.onQuestionDelete(questionNodeIndex);
        props.onQuestionStateChange(false);
        setEditMode(false);
      }

      // Capture the value radio button selected 
      const handleEssayQuestionSizeChange = (value) => {
        let essayQuestionSize = "essayQuestionSize";
        setFormData({ ...formData, [essayQuestionSize]: value });
      }
      
    return (
        <div>
        { !editMode ? (
            <div className="mb-1 d-flex align-items-center m-2 addfolder-container">
                
                <div className="flex-grow-1 d-flex align-items-center ml-7 d-flex align-items-center">
                    <div className="mr-2">{questionNodeIndex+1})</div>
                    <div>{formData.question} </div>
                </div>
                <div className="flex-grow-1 mr-7 d-flex align-items-center d-flex justify-content-end">                   
                    <Link className="savelink" onClick={handleEdit}>Edit</Link>
                    <Link className="deletelink" onClick={handleDelete}>Delete</Link>
                </div>
                
            </div>
        ) : (
            <div className="m-2">
                <Form onSubmit={handleSubmit} className="editmode border rounded p-3 bg-light">
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label className="mb-1">{questionNode.qtiModel.QstnSectionTitle}</Form.Label>
                    <Form.Control type="text" name="question" value={formData.question} onChange={handleChange}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label className="mb-1">{questionNode.qtiModel.EditRecommendedAnswer}</Form.Label>
                    <Form.Control as="textarea" rows={3} name="answer" value={formData.answer} onChange={handleChange} />
                </Form.Group>
                <div
                        onClick={() => setOpen(!open)}
                        className="d-flex align-items-center mb-3"
                        style={{ cursor: 'pointer' }}
                    >
                        {open ?<i class="bi bi-caret-up-fill"></i> : <i class="bi bi-caret-down-fill"></i>}
                        <span className="ms-2">Format and add metadata</span>
                </div>
                <Collapse key={open ? 'open' : 'closed'} in={open}>
                    <div id="example-collapse-text" className={`d-flex gap-2 ${open ? 'visible' : 'invisible'}`}>
                        <label htmlFor="option1">Essay Space:</label>
                        <input type="radio" id="option1" name="options" value="0" checked={0 == formData.essayQuestionSize} onChange={(e) => handleEssayQuestionSizeChange(e.target.value)} />
                        <label htmlFor="option1">None</label>

                        <input type="radio" id="option2" name="options" value="10" checked={10 == formData.essayQuestionSize} onChange={(e) => handleEssayQuestionSizeChange(e.target.value)} />
                        <label htmlFor="option2">1/4 page</label>

                        <input type="radio" id="option3" name="options" value="20" checked={20 == formData.essayQuestionSize} onChange={(e) => handleEssayQuestionSizeChange(e.target.value)}  />
                        <label htmlFor="option3">1/2 page</label>

                        <input type="radio" id="option4" name="options" value="40" checked={40 == formData.essayQuestionSize} onChange={(e) => handleEssayQuestionSizeChange(e.target.value)} />
                        <label htmlFor="option4">1 page</label>
                    </div>
                </Collapse>

                <div className="mb-1 d-flex justify-content-end">
                <Link className="savelink" onClick={handleSubmit}>Save</Link>
                <Link className="deletelink" onClick={handleDelete}>Delete</Link>
                </div>
                </Form>
            </div>
            )
        }      
        </div>
    );
}
export default Essay;