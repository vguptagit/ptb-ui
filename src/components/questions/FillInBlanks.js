import { Link } from "react-router-dom";
import { Collapse, Form } from "react-bootstrap";
import { useState, useRef } from "react";
import React from 'react';
import Button from "react-bootstrap/Button";
import DOMPurify from 'dompurify';
import jquery from 'jquery';
import ContentEditable from 'react-contenteditable'
import { FormattedMessage } from 'react-intl';
import CustomQuestionBanksService from "../../services/CustomQuestionBanksService";
import QtiService from "../../utils/qtiService";

const FillInBlanks = (props) => {
    const [open, setOpen] = useState(false);
    const questionNode = props.questionNode;
    const questionNodeIndex = props.questionNodeIndex;
    // const initFormData = getInitFormState(questionNode);
    const [formData, setFormData] = useState(() => {
        let initFormData = {
            Caption: questionNode.qtiModel ? questionNode.qtiModel.Caption : "",
            Options: questionNode.qtiModel ? questionNode.qtiModel.Options : ["", "", "", ""],
            CorrectAnswer: questionNode.qtiModel ? questionNode.qtiModel.CorrectAnswer : -1,
            CorrectAnswerHtml: questionNode.qtiModel ? questionNode.qtiModel.CorrectAnswerHtml : "",
            FIBBlankSpace: questionNode.qtiModel ? questionNode.qtiModel.BlankSize : "",

            EditableCorrectAnswers: []
        }
        var domContent = jquery(jquery.parseHTML(initFormData.CorrectAnswerHtml));

        domContent.each((index, item) => {
            let answer = jquery(item).children()[0].innerHTML;
            let blankCount = index + 1;
            var answerTemplate = "<div class='editView editablediv crtAnsDiv fbansw' type='text' id='RESPONSE_" + blankCount + "' >" + String.fromCharCode(65 + blankCount - 1) + ".<div contenteditable='true' class='placeHolderForBlank' data-placeholder='Enter the correct answer for blank " + String.fromCharCode(65 + blankCount - 1) + "'>$__ANSWER__</div></div>";
            var item = {
                name: "RESPONSE_" + blankCount,
                answer: answer,
                answerHtml: answerTemplate
            };
            initFormData.EditableCorrectAnswers.push(item);
        });
        //text.current = initFormData.Caption;

        return initFormData;
    });
    const text = useRef(questionNode.qtiModel.Caption);
    const [emptyQuestion, setEmptyQuestion] = useState(() => {
        let emptyAnswers = formData.EditableCorrectAnswers.filter((item) => item.answer == "");
        return (text.current == "" || emptyAnswers.length > 0);
    });


    const handleFIBBlankSpace = (value) => {
        let FIBBlankSpace = "FIBBlankSpace";
        setFormData({ ...formData, [FIBBlankSpace]: value });
    };

    const handleContentChange = evt => {
        console.log(evt.target.value);
        let currentTextValue = evt.target.value;
        let buttons = (currentTextValue.match(/RESPONSE_\d{1}/g) || []);
        if (buttons.length != formData.EditableCorrectAnswers.length) {
            let modifiedCorrectAnswers = formData.EditableCorrectAnswers.filter((item) => {
                return buttons.includes(item.name);
            });
            setFormData({ ...formData, EditableCorrectAnswers: modifiedCorrectAnswers })
        }
        text.current = currentTextValue;
        setEmptyQuestion(() => {
            let emptyAnswers = formData.EditableCorrectAnswers.filter((item) => item.answer == "");
            return (text.current == "" || emptyAnswers.length > 0);
        })
    };

    const handleContentBlur = () => {
        setEmptyQuestion(() => {
            let emptyAnswers = formData.EditableCorrectAnswers.filter((item) => item.answer == "");
            return (text.current == "" || emptyAnswers.length > 0);
        })
    };

    const handleBlank = (e) => {
        const { name, value } = e.target;
        var textEntryInteraction = '<button id="RESPONSE_$index" class="blankFIBButton">' +
            '<span contenteditable="false" class="blankWidth editView"><b contenteditable="false">$charIndex.</b>Fill Blank</span></button> &nbsp;';

        var blankCount = formData.EditableCorrectAnswers.length;
        blankCount = blankCount + 1;
        textEntryInteraction = textEntryInteraction.replace("$index", blankCount);
        textEntryInteraction = textEntryInteraction.replace("$charIndex", String.fromCharCode(65 + blankCount - 1));

        let updatedContent = text.current + textEntryInteraction;


        text.current = updatedContent;
        setFormData({ ...formData, Caption: updatedContent });

        addEditableCorrectAnswersChange(blankCount);
        // Add logic here

    };

    const addEditableCorrectAnswersChange = (blankCount) => {
        const tempArray = [...formData.EditableCorrectAnswers];
        var correctAnswerInteraction = "<div class='editView editablediv crtAnsDiv fbansw' type='text' id='RESPONSE_" + blankCount + "' >" + String.fromCharCode(65 + blankCount - 1) + ".<div contenteditable='true' class='placeHolderForBlank' data-placeholder='Enter the correct answer for blank " + String.fromCharCode(65 + blankCount - 1) + "'>$__ANSWER__</div></div>";
        var item = {
            name: "RESPONSE_" + blankCount,
            answer: "",
            answerHtml: correctAnswerInteraction
        };
        tempArray.push(item);
        setFormData({ ...formData, EditableCorrectAnswers: tempArray })
        setEmptyQuestion(() => {
            return true;
        })
    }

    const handleAnswerChange = (e) => {
        const { name, value } = e.target;
        //copying data to temp variable so that we do not directly mutate original state
        const tempAnswers = [...formData.EditableCorrectAnswers];
        //findIndex to find location of item we need to update
        let item = tempAnswers.filter(item => item.name === name);
        item[0].answer = value;
        setFormData({ ...formData, EditableCorrectAnswers: tempAnswers })
        setEmptyQuestion(() => {
            let emptyAnswers = formData.EditableCorrectAnswers.filter((item) => item.answer == "");
            return (text.current == "" || emptyAnswers.length > 0);
        })
    }

    const handleOptionsChange = (e) => {
        const { name, value } = e.target;
        //copying data to temp variable so that we do not directly mutate original state
        const tempOptions = [...formData.Options];
        //findIndex to find location of item we need to update
        tempOptions[name] = value;
        setFormData({ ...formData, Options: tempOptions })
    }

    const getPrintModeFbCaption = (Caption) => {
        try {
            var htmlText = Caption.trim().replaceAll("&amp;nbsp;", " ");
            htmlText = htmlText.replaceAll("&lt;", "<").replaceAll("&gt;", ">");
            var element = jquery('<p></p>');
            jquery(element).append(htmlText);
            element.find("button").each(function (i, obj) {
                let blankSpace = "<span class='blank'> _____________________ </span>";
                switch (formData.FIBBlankSpace) {
                    case "100":
                        blankSpace = "<span class='blank'>____________________________________________________________________________________________________</span>";
                        break;
                    case "50":
                        blankSpace = "<span class='blank'>__________________________________________________</span>";
                        break;
                    default:
                        blankSpace = "<span class='blank'>____________________</span>";
                }
                jquery(obj).replaceWith(blankSpace);
            });
            return element[0].innerHTML;
        } catch (e) {

        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (questionNode) {
            questionNode.qtiModel.Caption = '<div class="__marker__">' + text.current + "</div>";
            questionNode.qtiModel.EditableCorrectAnswers = formData.EditableCorrectAnswers;
            questionNode.qtiModel.CorrectAnswer = formData.CorrectAnswer;
            let fullAnswerHtml = ""
            formData.EditableCorrectAnswers.forEach((item) => {
                let answerHtml = item.answerHtml;
                answerHtml = answerHtml.replace("$__ANSWER__", item.answer);
                fullAnswerHtml = fullAnswerHtml + answerHtml;
            });
            questionNode.qtiModel.CorrectAnswerHtml = fullAnswerHtml;
            questionNode.qtiModel.EditOption = false;
            questionNode.qtiModel.BlankSize = formData.FIBBlankSpace;
            let jsonToXML = QtiService.getQtiXML(questionNode);
            questionNode.data = jsonToXML;
            const questionTemplates = CustomQuestionBanksService.questionTemplates(questionNode);

            let xmlToHtml = getPrintModeFbCaption(questionNode.qtiModel.Caption);
    
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
        let textContent = questionNode.qtiModel.Caption;
        if (textContent.includes("__marker__")) {
            textContent = textContent.replace('<div class="__marker__">', "").replace(/<\/div>$/, "");
        }
        text.current = textContent;
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
        return (
            <div className="m-2">
                <Form className="editmode border rounded p-3 bg-light">
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label className="mb-1"><b>{props.questionNode.qtiModel.QstnSectionTitle}</b></Form.Label>
                            <ContentEditable html={text.current} onBlur={handleContentBlur} onChange={handleContentChange} className="rounded form-control fib-content-area" />
                            <div className="float-right">
                                <Button
                                    id="dropdown-item-button"
                                    title={<FormattedMessage id="addBlankButton" defaultMessage="Add Blank" />}
                                    className="btn-test mt-3 mb-1 mb-sm-0 mr-sm-1 mr-1"
                                    onClick={(e) => handleBlank(e)}>
                                    <FormattedMessage id="addBlankButton" defaultMessage="Add Blank" />
                                </Button>
                            </div>
                            <div className="fib-answers-area mt-3 clear-both">
                                <b>Correct Answer</b>
                                <div id="fbAnswerContainer" className="mb-1 mt-3 d-flex flex-wrap">
                                    {
                                        formData.EditableCorrectAnswers.map((item, index) => {
                                            return (
                                                <div key={index} className="mc-flex-row mb-2">
                                                    <div className="mc-col fb-col-1">
                                                        {String.fromCharCode(65 + index) + "."}
                                                    </div>
                                                    <div className="mc-col fb-col-2">
                                                        <Form.Control
                                                            type="text"
                                                            name={item.name}
                                                            value={item.answer}
                                                            placeholder={"Enter the correct answer for blank " + String.fromCharCode(65 + index)}
                                                            onChange={handleAnswerChange} />
                                                    </div>
                                                </div>
                                            );
                                        }
                                        )}
                                </div>
                            </div>
                        </Form.Group>
                        <div onClick={() => setOpen(!open)} className="d-flex align-items-center mb-3" style={{ cursor: "pointer" }}>
                            {open ? (
                                <i className="bi bi-caret-down-fill"></i>
                            ) : (
                                    <i className="bi bi-caret-right-fill"></i>
                                )}
                            <span className="ms-2">
                                <b>
                                    <FormattedMessage id="newKeyForMetadata" defaultMessage="Format and add metadata" />
                                </b>
                            </span>
                        </div>
                        <Collapse key={open ? "open" : "closed"} in={open}>
                            <div id="example-collapse-text" className={`d-flex gap-2 ${open ? "visible" : "invisible"}`}>
                                <label htmlFor="option1">
                                    <FormattedMessage id="blankSizeLabel" defaultMessage="Blank Size:" />
                                </label>
                                <input
                                    type="radio"
                                    id="option1"
                                    name="options"
                                    value="20"
                                    checked={20 == formData.FIBBlankSpace}
                                    onChange={(e) => handleFIBBlankSpace(e.target.value)}
                                />
                                <label htmlFor="option1">
                                    <FormattedMessage id="smallOption" defaultMessage="Small" />
                                </label>
                                <input
                                    type="radio"
                                    id="option2"
                                    name="options"
                                    value="50"
                                    checked={50 == formData.FIBBlankSpace}
                                    onChange={(e) => handleFIBBlankSpace(e.target.value)}
                                />
                                <label htmlFor="option2">
                                    <FormattedMessage id="mediumOption" defaultMessage="Medium" />
                                </label>
                                <input
                                    type="radio"
                                    id="option3"
                                    name="options"
                                    value="100"
                                    checked={100 == formData.FIBBlankSpace}
                                    onChange={(e) => handleFIBBlankSpace(e.target.value)}
                                />
                                <label htmlFor="option3">
                                    <FormattedMessage id="largeOption" defaultMessage="Large" />
                                </label>
                            </div>
                        </Collapse>
                        <div className="mb-1 d-flex justify-content-end">
                            <Link className={`savelink ${emptyQuestion ? 'disabled-link' : ''}`} onClick={handleSubmit} tabIndex={emptyQuestion ? -1 : 0}>
                                <FormattedMessage id="viewButtonfillinBlanks" defaultMessage="View" />
                            </Link>
                            <Link className="deletelink" onClick={handleDelete}>
                                <FormattedMessage id="removeButtonFillInBlanks" defaultMessage="Remove" />
                            </Link>
                        </div>
                    </Form>  
            </div>
        );
      }
    
      const getPrintOnlyView = () => {
       return (
          <div className="mb-1 d-flex align-items-center m-2 addfolder-container">
            <div className="flex-grow-1 d-flex ml-7 d-flex align-items-start">
                <div className="mr-2"> {questionNodeIndex + 1}) </div>
                <div className="view-content" dangerouslySetInnerHTML={sanitizedData(getPrintModeFbCaption(text.current))}></div>
            </div>
          </div>
        );
      }
    
      const getPrintWithEditView = () => {
        return (
            <div className="mb-3 d-flex align-items-center m-2 addfolder-container">
                <div className="flex-grow-1 d-flex ml-7 d-flex align-items-start">
                    <div className="mr-2"> {questionNodeIndex + 1}) </div>
                    <div className="view-content" dangerouslySetInnerHTML={sanitizedData(getPrintModeFbCaption(text.current))}></div>
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
            <div className="flex-grow-1 d-flex ml-7 d-flex align-items-start">
                <div className="mr-2"> {questionNodeIndex + 1}) </div>
                <div className="view-content" dangerouslySetInnerHTML={sanitizedData(getPrintModeFbCaption(text.current))}></div>
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
export default FillInBlanks;