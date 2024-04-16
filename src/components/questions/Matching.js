import React, { useState, useEffect } from 'react';
import { Collapse, Form } from 'react-bootstrap';
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import CustomQuestionBanksService from "../../services/CustomQuestionBanksService";
import QtiService from "../../utils/qtiService";

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
    
  
        const areOptionsFilled = formData.Options.every(opt => opt.option.trim() !== '' && opt.matchingOption.trim() !== '');
    
      
        const isViewButtonEnabled = isCaptionFilled && areOptionsFilled;
    
        return (
            <div className="m-2">
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
                            maxLength={255} 
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
                                                        maxLength={255} 
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
                                                        maxLength={255} 
                                                    />
                                                </div>
                                            </Form.Group>
                                        </div>
                                    );
                                })}
                        </Form.Group>
    
                    </Form.Group>
    
                    <div className="mb-1 d-flex justify-content-end">
                        <Link
                            className={`savelink ${!isViewButtonEnabled ? 'disabled-link' : ''}`}
                            onClick={handleSubmit}
                            tabIndex={!isViewButtonEnabled ? -1 : 0}
                            disabled={!isViewButtonEnabled} 
                        >
                            <FormattedMessage id="viewButtonMatching" defaultMessage="View" />
                        </Link>
                        <Link className="deletelink" onClick={handleDelete}>
                            <FormattedMessage id="removeButtonMatching" defaultMessage="Remove" />
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
                        <div className="w-100 ml-1">
                            <div className="mr-2">{questionNodeIndex + 1}) <span className="view-content" dangerouslySetInnerHTML={sanitizedData(questionNode.qtiModel.Caption)}></span></div>
                        </div>
                        <div className="w-100" style={{ paddingTop: "15px" }}>
                            {questionNode.qtiModel.Options.map((option, index) => (
                                <div key={index} className="view-question">
                                    <div className="text-section d-flex flex-wrap">
                                        <span className="ml-3 ml-md-0"  style={{ minWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={option.option} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(`A${index + 1}) ${option.option}`) }}></span>
                                        <span className="ml-3 ml-md-0" style={{ minWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={option.matchingOption}  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(`B${index + 1}) ${option.matchingOption}`) }}></span>
                                    </div>
                                </div>
                            ))}


                        </div>
                    </div>
                </div>
        );
    }

    const getPrintWithEditView = () => {
        return (
            <div className="mb-1 d-flex align-items-center m-2 addfolder-container">
                    <div className="flex-grow-1 d-flex align-items-center ml-7 d-flex align-items-center flex-wrap">
                        <div className="w-100 ml-1">
                            <div className="mr-2">{questionNodeIndex + 1}) <span className="view-content" dangerouslySetInnerHTML={sanitizedData(questionNode.qtiModel.Caption)}></span></div>
                        </div>
                        <div className="w-100" style={{ paddingTop: "15px" }}>
                            {questionNode.qtiModel.Options.map((option, index) => (
                                <div key={index} className="view-question">
                                    <div className="text-section d-flex flex-wrap">
                                        <span className="ml-3 ml-md-0"   style={{ minWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={option.option}  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(`A${index + 1}) ${option.option}`) }}></span>
                                        <span className="ml-3 ml-md-0"   style={{ minWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={option.matchingOption} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(`B${index + 1}) ${option.matchingOption}`) }}></span>
                                    </div>
                                </div>
                            ))}


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
                        <div className="w-100 ml-1">
                            <div className="mr-2">{questionNodeIndex + 1}) <span className="view-content" dangerouslySetInnerHTML={sanitizedData(questionNode.qtiModel.Caption)}></span></div>
                        </div>
                        <div className="w-100" style={{ paddingTop: "15px" }}>
                            {questionNode.qtiModel.Options.map((option, index) => (
                                <div key={index} className="view-question">
                                    <div className="text-section d-flex flex-wrap">
                                        <span className="ml-3 ml-md-0"   style={{ minWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={option.option}  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(`A${index + 1}) ${option.option}`) }}></span>
                                        <span className="ml-3 ml-md-0"   style={{ minWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={option.matchingOption} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(`B${index + 1}) ${option.matchingOption}`) }}></span>
                                    </div>
                                </div>
                            ))}


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

export default Matching;