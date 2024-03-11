import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FormattedMessage } from "react-intl";
import Toastify from '../common/Toastify';

const exportFileFormats = [
  { value: 'doc', text: 'MS Word' },
  { value: 'pdf', text: 'PDF' },
  { value: 'bbpm', text: 'Blackboard Pool manager' },
  { value: 'bbtm', text: 'Blackboard Test manager' },
  { value: 'qti21', text: 'QTI 2.1' }
];

const answerAreas = [
  { value: 'NONE', isDisabled: false, text: 'None' },
  { value: 'BETWEENQUESTIONS', isDisabled: false, text: 'Between questions' },
  { value: 'LEFTSIDE', isDisabled: false, text: 'Left side of the page' },
  { value: 'LASTPAGE', isDisabled: true, text: 'Blank last page' },
];

const answerKeys = [
  { value: 'NONE', text: 'None' },
  { value: 'SAMEFILE', text: 'Same file' },
  { value: 'SEPARATEFILE', text: 'Separate file' },
];

const margins = [
  { value: '0.5', text: '0.5 inch' },
  { value: '1.0', text: '1 inch' },
  { value: '1.5', text: '1.5 inch' },
];

const pageNumbers = [
  { value: 'BOTTOMMIDDLE', text: 'Bottom middle' },
  { value: 'BOTTOMRIGHT', text: 'Bottom right' },
  { value: 'TOPRIGHT', text: 'Top right' },
];


function Modalpopupexport({ show, handleCloseModal, handleSave, selectedTest }) {
    const [selectedFormat, setSelectedFormat] = useState(exportFileFormats[0]);
  const [selectedAnswerArea, setSelectedAnswerArea] = useState(answerAreas[0]);
  const [selectedAnswerKey, setSelectedAnswerKey] = useState(answerKeys[0]);
  const [selectedMargin, setSelectedMargin] = useState(margins[1]);
  const [selectedPageNumber, setSelectedPageNumber] = useState(pageNumbers[0]);
  const [isSaveSettingsAsDefault, setIsSaveSettingsAsDefault] = useState(false);
  const [showMSWordSetting, setShowMSWordSetting] = useState(true);
  const [isIncludeRandomizedTest, setIsIncludeRandomizedTest] = useState(false);
  const [isIncludeStudentName, setIsIncludeStudentName] = useState(false);
  
  useEffect(() => {
    // Here you would fetch user print settings, similar to UserService.userPrintSettings in AngularJS
    // For now, we will simulate this with defaults
  }, []);

  const handleFormatChange = (format) => {
    //const formatValue = event.target.value;
    //const format = exportFileFormats.find(f => f.value === formatValue);
    setSelectedFormat(format);
    setShowMSWordSetting(format.value === 'doc' || format.value === 'pdf');
  };

  const handleExport = () => {
    // Implement export functionality here
    console.log("Exporting Test...");
    // Close the popup or navigate as necessary
  };

  const handleCancel = () => {
    // Close the popup or navigate as necessary
    console.log("Cancel");
  };

  return (
    <Modal show={show} onHide={handleCloseModal} centered>
      <Modal.Header >
      <div className="modal-header">
        <button type="button" className="close" onClick={handleCancel} aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        <h4 className="modal-title" id="myModalLabel">Export Tests</h4>
      </div>
        {/* <Modal.Title>
        <div className="modal-header">
        <button type="button" className="close" onClick={handleCancel} aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        <h4 className="modal-title" id="myModalLabel">Export Tests</h4>
      </div>
        </Modal.Title> */}
      </Modal.Header>
      <Modal.Body>
      <div className="modal-body">
        {/* Omitting the commented-out sections for brevity */}
        <div className="row">
          <div className="col-sm-6">
            <div className="bold">Export Format:</div>
            {exportFileFormats.map((format, index) => (
              <label key={index} className="text-radio-label margin-top-5">
                <input
                  type="radio"
                  name="fileFormat"
                  value={format.value}
                  checked={selectedFormat.value === format.value}
                  onChange={handleFormatChange}
                />
                <span>{format.text}</span>
              </label>
            ))}
          </div>
          {showMSWordSetting && (
            <div className="col-sm-6">
              {/* Similar mapping for answerAreas, margins, etc. */}
            </div>
          )}
        </div>

        {/* Implement other sections similarly, handling conditional rendering and input changes */}
      </div>
      <div className="modal-footer">
        <div className="row">
          <div className="col-sm-6">
            <button type="button" className="btn btn-default" onClick={handleCancel}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={handleExport}>Export</button>
          </div>
          <div className="col-sm-6">
            <label>
              <input
                type="checkbox"
                checked={isSaveSettingsAsDefault}
                onChange={e => setIsSaveSettingsAsDefault(e.target.checked)}
              />
              Save settings as default
            </label>
          </div>
        </div>
      </div>
      
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Cancel
        </Button>
        {/* <Button variant='primary' onClick={handleSaveClick}> Save </Button> */}
      </Modal.Footer>
    </Modal>
    
  );

};

export default Modalpopupexport;
