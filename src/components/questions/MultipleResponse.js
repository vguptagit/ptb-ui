import { Link } from "react-router-dom";
import { Collapse, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import { FormattedMessage } from 'react-intl';
import CustomQuestionBanksService from "../../services/CustomQuestionBanksService";
import QtiService from "../../utils/qtiService";

const MultipleResponse = (props) => {
    const [open, setOpen] = useState(false);
    const questionNode = props.questionNode;
    const questionNodeIndex = props.questionNodeIndex;
    const initFormData = {
        Caption: questionNode.qtiModel ? questionNode.qtiModel.Caption : "",
        Options: questionNode.qtiModel ? questionNode.qtiModel.Options : ["", "", "", ""],
        CorrectAnswer: questionNode.qtiModel ? questionNode.qtiModel.CorrectAnswer : [],
        Orientation: questionNode.qtiModel ? "true" : "false"
    };
    const [formData, setFormData] = useState(initFormData);
    const [selectedIndexes, setSelectedIndexes] = useState([]);

    useEffect(() => {
        // Update the formData's CorrectAnswer with selected indexes
        setFormData(prevFormData => ({
            ...prevFormData,
            CorrectAnswer: selectedIndexes
        }));
    }, [selectedIndexes]);

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

    const handleOptionsChange = (e) => {
        const { name, value } = e.target;
        const tempOptions = [...formData.Options];
        tempOptions[name] = value;
        setFormData({ ...formData, Options: tempOptions });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (questionNode) {
            questionNode.qtiModel.Caption = formData.Caption;
            questionNode.qtiModel.Options = formData.Options;
            questionNode.qtiModel.CorrectAnswer = formData.CorrectAnswer;
            questionNode.qtiModel.Orientation = formData.Orientation;
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


    const sanitizedData = (data) => ({
        __html: DOMPurify.sanitize(data)
    })

    const getEditView = () => {
        const isCaptionFilled = formData.Caption.trim() !== '';
        const areOptionsFilled = formData.Options.every(opt => opt && opt.trim() !== '');
        const isViewButtonEnabled = isCaptionFilled && areOptionsFilled;
    
        return (
            <div className="m-2">
                <Form className="editmode border rounded p-3 bg-light">
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label className="mb-1">{props.questionNode.qtiModel.QstnSectionTitle}</Form.Label>
                        <Form.Control
                            name="Caption"
                            onChange={handleChange}
                            value={formData.Caption}
                            className="mb-4"
                            type="text"
                            autoComplete="off"
                            placeholder={props.questionNode.qtiModel.EditCaption}
                        />
                        <Form.Group className="mb-1 mt-3 d-flex flex-wrap">
                            {formData.Options.map((optItem, index) => {
                                return (
                                    <Form.Group key={index} className="mc-flex-row mb-2">
                                        <div className="mc-col mc-col-1">
                                            <Form.Check
                                                type="checkbox"
                                                checked={formData.CorrectAnswer.includes(index)}
                                                value={index}
                                                className="item-1"
                                                name="CorrectAnswer"
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
                        <span className="ms-2">
                            <FormattedMessage id="formatMetadataMultipleResponse" />
                        </span>
                    </div>
                    <Collapse key={open ? "open" : "closed"} in={open}>
                        <div className="metadata-container">
                            <div className="mb-2">
                                <span className="caption-metadata">
                                    <FormattedMessage id="formatMultipleResponse" />
                                </span>
                                <span className="normal-text">
                                    <FormattedMessage id="visibleInPrintViewMultipleResponse" />
                                </span>
                            </div>
                            <div className="d-flex mc--orientation">
                                <Form.Check
                                    type="radio"
                                    onChange={handleChange}
                                    checked={"false" === formData.Orientation}
                                    className="mr-5"
                                    name="Orientation"
                                    value="false"
                                    label="Horizontal Displays"
                                />
    
                                <Form.Check
                                    type="radio"
                                    onChange={handleChange}
                                    checked={"true" === formData.Orientation}
                                    className=""
                                    name="Orientation"
                                    value="true"
                                    label="Vertical Display"
                                />
                            </div>
                        </div>
                    </Collapse>
                    <div className="mb-1 d-flex justify-content-end">
                        <Link className={`savelink ${!isViewButtonEnabled ? 'disabled-link' : ''}`} onClick={handleSubmit} tabIndex={!isViewButtonEnabled ? -1 : 0} disabled={!isViewButtonEnabled} >
                            <FormattedMessage id="viewMultipleResponse" />
                        </Link>
                        <Link className="deletelink" onClick={handleDelete}>
                            <FormattedMessage id="removeMultipleResponse" />
                        </Link>
                    </div>
                </Form>
            </div>
        );
    }
    
    const getPrintOnlyView = () => {
        return (
            <div className="mb-1 d-flex align-items-center m-2 addfolder-container">
                    <div className="flex-grow-1 d-flex align-items-center ml-7 d-flex align-items-center flex-wrap">
                        <div className={formData.CorrectAnswer !== -1 ? "w-100 ml-1" : "w-100"}>
                            <div className="mr-2" >{questionNodeIndex + 1}) <span className="view-content" dangerouslySetInnerHTML={sanitizedData(formData.Caption)}></span></div>
                        </div>

                        <div className="w-100" style={{ paddingTop: "15px" }}>
                            {formData.Options.map((value, index) => {
                                return (
                                    <div className="view-question"  >
                                        <div className="icon-section">
                                            <span className="icon-ml"></span>
                                        </div>
                                        <div className="text-section" >
                                            <span className="ml-1">{String.fromCharCode(index + 'A'.charCodeAt(0))})</span>
                                            <span className="ml-1 answer" dangerouslySetInnerHTML={sanitizedData(value)}></span>
                                        </div>
                                    </div>)
                            }
                            )}
                        </div>
                    </div>
                </div>
        );
    }

    const getPrintWithEditView = () => {
        return (
            <div className="mb-1 d-flex align-items-center m-2 addfolder-container">
                    <div className="flex-grow-1 d-flex align-items-center ml-7 d-flex align-items-center flex-wrap">
                        <div className={formData.CorrectAnswer !== -1 ? "w-100 ml-1" : "w-100"}>
                            <div className="mr-2" >{questionNodeIndex + 1}) <span className="view-content" dangerouslySetInnerHTML={sanitizedData(formData.Caption)}></span></div>
                        </div>

                        <div className="w-100" style={{ paddingTop: "15px" }}>
                            {formData.Options.map((value, index) => {
                                return (
                                    <div className="view-question"  >
                                        <div className="icon-section">
                                            {formData.CorrectAnswer.includes(index) ?
                                                <i className="bi bi-check" style={{ color: "green", marginRight: "2px" }} ></i>
                                                : <span className="icon-ml"></span>}
                                        </div>
                                        <div className={formData.CorrectAnswer.includes(index) ? "text-section checked" : "text-section"} >
                                            <span className="ml-1">{String.fromCharCode(index + 'A'.charCodeAt(0))})</span>
                                            <span className="ml-1 answer" dangerouslySetInnerHTML={sanitizedData(value)}></span>
                                        </div>
                                    </div>)
                            }
                            )}
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
    }

    const getPrintWithAnswerView = () => {
        return (
            <div className="mb-1 d-flex align-items-center m-2 addfolder-container">
                    <div className="flex-grow-1 d-flex align-items-center ml-7 d-flex align-items-center flex-wrap">
                        <div className={formData.CorrectAnswer !== -1 ? "w-100 ml-1" : "w-100"}>
                            <div className="mr-2" >{questionNodeIndex + 1}) <span className="view-content" dangerouslySetInnerHTML={sanitizedData(formData.Caption)}></span></div>
                        </div>

                        <div className="w-100" style={{ paddingTop: "15px" }}>
                            {formData.Options.map((value, index) => {
                                return (
                                    <div className="view-question"  >
                                        <div className="icon-section">
                                            {formData.CorrectAnswer.includes(index) ?
                                                <i className="bi bi-check" style={{ color: "green", marginRight: "2px" }} ></i>
                                                : <span className="icon-ml"></span>}
                                        </div>
                                        <div className={formData.CorrectAnswer.includes(index) ? "text-section checked" : "text-section"} >
                                            <span className="ml-1">{String.fromCharCode(index + 'A'.charCodeAt(0))})</span>
                                            <span className="ml-1 answer" dangerouslySetInnerHTML={sanitizedData(value)}></span>
                                        </div>
                                    </div>)
                            }
                            )}
                        </div>
                    </div>
                </div>
        );
    }

    const getPrintView = (viewId) => {
        if(viewId == 3) {
          return getPrintWithAnswerView();
        } else if (viewId == 2) {
          return getPrintWithEditView();
        } else {
          return getPrintOnlyView();
        }
    }

    return (
        <div id={questionNode.itemId}>
          {!questionNode.qtiModel.EditOption ? (
            getPrintView(props.printView)
          ) : (
            getEditView()
          )}
        </div>
      );
}

export default MultipleResponse;
