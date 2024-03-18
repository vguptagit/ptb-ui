import React, { useState, useEffect } from 'react';
import { Collapse, Form } from 'react-bootstrap';
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';

const Matching = (props) => {
    const [open, setOpen] = useState(false);
    const questionNode = props.questionNode;
    const questionNodeIndex = props.questionNodeIndex;
    const initFormData = {
        Caption: questionNode.qtiModel ? questionNode.qtiModel.Caption : "",
        Options: questionNode.qtiModel ? questionNode.qtiModel.Options : [{ option: "", matchingOption: "" }],
        Orientation: questionNode.qtiModel ? "true" : "false"

    };

    const [selectedIndexes, setSelectedIndexes] = useState([]);
    const [formData, setFormData] = useState(initFormData);

    const handleChange = (e) => {
        const { name, value, checked } = e.target;

        if (checked) {
            // Add the selected index to selectedIndexes array
            setSelectedIndexes(prevIndexes => [...prevIndexes, parseInt(value)]);
        } else {
            // Remove the deselected index from selectedIndexes array
            setSelectedIndexes(prevIndexes => prevIndexes.filter(index => index !== parseInt(value)));
        }

        setFormData({ ...formData, [name]: value });
    };
    const handleOptionsChange = (e, index) => {
        const { name, value } = e.target;
        const tempOptions = [...formData.Options];
        tempOptions[index][name] = value;
        setFormData({ ...formData, Options: tempOptions });
    };
    useEffect(() => {
        // Update the formData's CorrectAnswer with selected indexes
        setFormData(prevFormData => ({
            ...prevFormData,
            CorrectAnswer: selectedIndexes
        }));
    }, [selectedIndexes]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (questionNode) {
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
                <div className="mb-1 d-flex align-items-center m-2 addfolder-container">
                    <div className="flex-grow-1 d-flex align-items-center ml-7 d-flex align-items-center flex-wrap">
                        <div className="w-100 ml-1">
                            <div className="mr-2">{questionNodeIndex + 1}) <span dangerouslySetInnerHTML={sanitizedData(questionNode.qtiModel.Caption)}></span></div>
                        </div>
                        <div className="w-100" style={{ paddingTop: "15px" }}>
                        {questionNode.qtiModel.Options.map((option, index) => (
    <div key={index} className="view-question">
        <div className="text-section d-flex flex-wrap">
            <span className="ml-3 ml-md-0" style={{ minWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={option.option}>{`A${index + 1}) ${option.option.length > 15 ? option.option.substring(0, 15) + '...' : option.option}`}</span>
            <span className="ml-3 ml-md-0" style={{ minWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={option.matchingOption}>{`B${index + 1}) ${option.matchingOption.length > 15 ? option.matchingOption.substring(0, 15) + '...' : option.matchingOption}`}</span>
        </div>
    </div>
))}


                        </div>
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
                <Form className="editmode border rounded p-3 bg-light">
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label className="mb-1" style={{ fontSize: '0.9em' }}>{props.questionNode.qtiModel.QstnSectionTitle}</Form.Label>
                        <Form.Control
                            name="Caption"
                            onChange={(e) => setFormData({ ...formData, Caption: e.target.value })}
                            value={formData.Caption}
                            className="mb-4"
                            type="text"
                            autoComplete="off"
                            placeholder={props.questionNode.qtiModel.EditCaption}
                        />
                        <Form.Group className="mb-1">
                            {formData?.Options?.length > 0 &&
                                formData?.Options.map((optItem, index) => {
                                    return (
                                        <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <Form.Group style={{ marginBottom: '5px', width: '50%' }}>
                                                <div>
                                                    <Form.Control
                                                        onChange={(e) => handleOptionsChange(e, index)}
                                                        value={optItem.option}
                                                        name="option"
                                                        type="text"
                                                        placeholder={props.questionNode.qtiModel.editOption_Column_A1 + (index + 1) + props.questionNode.qtiModel.editOption_Column_A2}
                                                    />
                                                </div>
                                            </Form.Group>
                                            <Form.Group style={{ marginBottom: '5px', width: '50%' }}>
                                                <div>
                                                    <Form.Control
                                                        onChange={(e) => handleOptionsChange(e, index)}
                                                        value={optItem.matchingOption}
                                                        name="matchingOption"
                                                        type="text"
                                                        placeholder={props.questionNode.qtiModel.editOption_Column_B + (index + 1)}
                                                    />
                                                </div>
                                            </Form.Group>
                                        </div>
                                    );
                                })}
                        </Form.Group>

                    </Form.Group>

                    <div className="mb-1 d-flex justify-content-end " >
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

export default Matching;