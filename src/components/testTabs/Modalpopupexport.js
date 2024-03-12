import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
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
      <Modal.Header closeButton>
        <Modal.Title>Export Tests</Modal.Title>
      </Modal.Header>


      <Modal.Body>
        <Form>
          <Form.Group as={Row}>
            <Form.Label column sm="6">Export Format:</Form.Label>
            <Col sm="6">
              {exportFileFormats.map((format, index) => (
                <Form.Check
                  type="radio"
                  label={format.text}
                  name="exportFormat"
                  id={`exportFormat-${index}`}
                  checked={selectedFormat.value === format.value}
                  onChange={() => handleFormatChange(format)}
                />
              ))}
            </Col>
          </Form.Group>
          {/* Margins Section */}
          <Form.Group as={Row}>
            <Form.Label column sm="6">Margins:</Form.Label>
            <Col sm="6">
              {margins.map((margin, index) => (
                <Form.Check
                  type="radio"
                  label={margin.text}
                  name="margins"
                  id={`margin-${index}`}
                  checked={selectedMargin.value === margin.value}
                  onChange={() => setSelectedMargin(margin)}
                />
              ))}
            </Col>
          </Form.Group>
          {/* Answer Area Section */}
          <Form.Group as={Row}>
            <Form.Label column sm="6">Answer Area:</Form.Label>
            <Col sm="6">
              {answerAreas.map((area, index) => (
                <Form.Check
                  type="radio"
                  label={area.text}
                  name="answerArea"
                  id={`answerArea-${index}`}
                  checked={selectedAnswerArea.value === area.value}
                  onChange={() => setSelectedAnswerArea(area)}
                  disabled={area.isDisabled}
                />
              ))}
            </Col>
          </Form.Group>
          {/* Answer Key Section */}
          <Form.Group as={Row}>
            <Form.Label column sm="6">Answer Key:</Form.Label>
            <Col sm="6">
              {answerKeys.map((key, index) => (
                <Form.Check
                  type="radio"
                  label={key.text}
                  name="answerKey"
                  id={`answerKey-${index}`}
                  checked={selectedAnswerKey.value === key.value}
                  onChange={() => setSelectedAnswerKey(key)}
                />
              ))}
            </Col>
          </Form.Group>
          {/* Page Number Section */}
          <Form.Group as={Row}>
            <Form.Label column sm="6">Page Number:</Form.Label>
            <Col sm="6">
              {pageNumbers.map((number, index) => (
                <Form.Check
                  type="radio"
                  label={number.text}
                  name="pageNumber"
                  id={`pageNumber-${index}`}
                  checked={selectedPageNumber.value === number.value}
                  onChange={() => setSelectedPageNumber(number)}
                />
              ))}
            </Col>
          </Form.Group>

          {/* Additional Options */}
          <Form.Group as={Row}>
          <Form.Label column sm="6">Labels and Versions:</Form.Label>
            <Col sm="6">
              <Form.Check
                type="checkbox"
                label="Add student name label & space"
                checked={isIncludeStudentName}
                onChange={(e) => setIsIncludeStudentName(e.target.checked)}
              />
            
              <Form.Check
                type="checkbox"
                label="Include all test versions"
                checked={isIncludeRandomizedTest}
                onChange={(e) => setIsIncludeRandomizedTest(e.target.checked)}
              />
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body >
    <Modal.Footer>
      <Button variant="secondary" onClick={handleCloseModal}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleExport}>
        Export
      </Button>
      <Form.Check
        type="checkbox"
        label="Save settings as default"
        checked={isSaveSettingsAsDefault}
        onChange={(e) => setIsSaveSettingsAsDefault(e.target.checked)}
      />
    </Modal.Footer>
    </Modal >
    
  );

  // return (
  //   <Modal show={show} onHide={handleCloseModal} centered>
  //     <Modal.Header closeButton>
  //       <Modal.Title>Export Tests</Modal.Title>
  //     </Modal.Header>

  //     <Modal.Body>
  //       <Form>
  //         <div className="settings-section">
  //           <div className="settings-block">
  //             <Form.Label>Export Format:</Form.Label>
  //             <div className="settings-options">
  //               {exportFileFormats.map((format, index) => (
  //                 <Form.Check
  //                   type="radio"
  //                   label={format.text}
  //                   name="exportFormat"
  //                   id={`exportFormat-${index}`}
  //                   checked={selectedFormat.value === format.value}
  //                   onChange={() => handleFormatChange(format)}
  //                   key={index}
  //                 />
  //               ))}
  //             </div>
  //           </div>

  //           <div className="settings-block">
  //             <Form.Label>Margins:</Form.Label>
  //             <div className="settings-options">
  //               {margins.map((margin, index) => (
  //                 <Form.Check
  //                   type="radio"
  //                   label={margin.text}
  //                   name="margins"
  //                   id={`margin-${index}`}
  //                   checked={selectedMargin.value === margin.value}
  //                   onChange={() => setSelectedMargin(margin)}
  //                   key={index}
  //                 />
  //               ))}
  //             </div>
  //           </div>

  //           <div className="settings-block">
  //             <Form.Label>Answer Area:</Form.Label>
  //             <div className="settings-options">
  //               {answerAreas.map((area, index) => (
  //                 <Form.Check
  //                   type="radio"
  //                   label={area.text}
  //                   name="answerArea"
  //                   id={`answerArea-${index}`}
  //                   checked={selectedAnswerArea.value === area.value}
  //                   onChange={() => setSelectedAnswerArea(area)}
  //                   disabled={area.isDisabled}
  //                   key={index}
  //                 />
  //               ))}
  //             </div>
  //           </div>

  //           <div className="settings-block">
  //             <Form.Label>Answer Key:</Form.Label>
  //             <div className="settings-options">
  //               {answerKeys.map((key, index) => (
  //                 <Form.Check
  //                   type="radio"
  //                   label={key.text}
  //                   name="answerKey"
  //                   id={`answerKey-${index}`}
  //                   checked={selectedAnswerKey.value === key.value}
  //                   onChange={() => setSelectedAnswerKey(key)}
  //                   key={index}
  //                 />
  //               ))}
  //             </div>
  //           </div>

  //           <div className="settings-block">
  //             <Form.Label>Page Number:</Form.Label>
  //             <div className="settings-options">
  //               {pageNumbers.map((number, index) => (
  //                 <Form.Check
  //                   type="radio"
  //                   label={number.text}
  //                   name="pageNumber"
  //                   id={`pageNumber-${index}`}
  //                   checked={selectedPageNumber.value === number.value}
  //                   onChange={() => setSelectedPageNumber(number)}
  //                   key={index}
  //                 />
  //               ))}
  //             </div>
  //           </div>
  //         </div>

  //         {/* Additional Options */}
  //         <div className="additional-options">
  //           <Form.Check
  //             type="checkbox"
  //             label="Add student name label & space"
  //             checked={isIncludeStudentName}
  //             onChange={(e) => setIsIncludeStudentName(e.target.checked)}
  //             id="includeStudentName"
  //           />

  //           <Form.Check
  //             type="checkbox"
  //             label="Include all test versions"
  //             checked={isIncludeRandomizedTest}
  //             onChange={(e) => setIsIncludeRandomizedTest(e.target.checked)}
  //             id="includeAllTestVersions"
  //           />
  //         </div>
  //       </Form>
  //     </Modal.Body>

  //     <Modal.Footer>
  //       <Button variant="secondary" onClick={handleCloseModal}>
  //         Cancel
  //       </Button>
  //       <Button variant="primary" onClick={handleExport}>
  //         Export
  //       </Button>
  //       <Form.Check
  //         type="checkbox"
  //         label="Save settings as default"
  //         checked={isSaveSettingsAsDefault}
  //         onChange={(e) => setIsSaveSettingsAsDefault(e.target.checked)}
  //         id="saveSettingsAsDefault"
  //       />
  //     </Modal.Footer>
  //   </Modal>
  // );

};

export default Modalpopupexport;
