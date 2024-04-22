import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Container } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import Toastify from '../common/Toastify';
import { exportTest, getPrintsettings, savePrintsettings } from '../../services/testcreate.service';
import './Modalpopupexport.css';
import Loader from '../common/loader/Loader';
import { downloadFile } from '../../utils/common';

//exportFileFormat
const exportFileFormats = [
  { value: 'doc', text: 'MS Word', fileExtension: 'doc' },
  { value: 'pdf', text: 'PDF', fileExtension: 'pdf' },
  { value: 'bbpm', text: 'Blackboard Pool manager', fileExtension: 'zip' },
  { value: 'bbtm', text: 'Blackboard Test manager', fileExtension: 'zip' },
  { value: 'qti21', text: 'QTI 2.1', fileExtension: 'zip' },
];
//"includeAreaForStudentResponse": "NONE", - Answer Area
const answerAreas = [
  { value: 'NONE', isDisabled: false, text: 'None' },
  { value: 'BETWEENQUESTIONS', isDisabled: false, text: 'Between questions' },
  { value: 'LEFTSIDE', isDisabled: false, text: 'Left side of the page' },
  { value: 'LASTPAGE', isDisabled: false, text: 'Blank last page' },
];
//"includeAnswerKeyIn": "NONE",  - Answer Key:
const answerKeys = [
  { value: 'NONE', text: 'None' },
  { value: 'SAMEFILE', text: 'Same file' },
  { value: 'SEPARATEFILE', text: 'Separate file' },
];

// "topMargin": "1.9", - Margins:
//     "bottomMargin": "1.9", - Margins:
//     "leftMargin": "1.9", - Margins:
//     "rightMargin": "1.9", - Margins:
const margins = [
  { value: '0.5', text: '0.5 inch' },
  { value: '1.0', text: '1 inch' },
  { value: '1.5', text: '1.5 inch' },
];
// "pageNumberDisplay": "BOTTOMRIGHT"
const pageNumbers = [
  { value: 'BOTTOMMIDDLE', text: 'Bottom middle' },
  { value: 'BOTTOMRIGHT', text: 'Bottom right' },
  { value: 'TOPRIGHT', text: 'Top right' },
];
//  "includeRandomizedTests": false, - Labels and Versions:
//"includeStudentName": true, - Labels and Versions:

function Modalpopupexport({
  show,
  handleCloseModal,
  handleSave,
  selectedTest,
  showModalExport,
  backdrop,
  keyboard,
  width,
}) {
  const intl = useIntl();
  const [selectedFormat, setSelectedFormat] = useState(exportFileFormats[0]);
  const [selectedAnswerArea, setSelectedAnswerArea] = useState(answerAreas[0]);
  const [selectedAnswerKey, setSelectedAnswerKey] = useState(answerKeys[0]);
  const [selectedMargin, setSelectedMargin] = useState(margins[1]);
  const [selectedPageNumber, setSelectedPageNumber] = useState(pageNumbers[0]);
  const [isSaveSettingsAsDefault, setIsSaveSettingsAsDefault] = useState(false);
  const [showMSWordSetting, setShowMSWordSetting] = useState(true);
  // const [isIncludeRandomizedTest, setIsIncludeRandomizedTest] = useState(false);
  const [isIncludeStudentName, setIsIncludeStudentName] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setShowMSWordSetting(true);
      const fetchPrintSettings = async () => {
        try {
          const settings = await getPrintsettings();
          const format = exportFileFormats.find(f => f.value === settings.exportFileFormat) || exportFileFormats[0];
          setSelectedFormat(format);
          setShowMSWordSetting(isMSWordOrPDFSelected(format.value));
          setSelectedAnswerArea(
            answerAreas.find(a => a.value === settings.includeAreaForStudentResponse) || answerAreas[0]
          );
          setSelectedAnswerKey(answerKeys.find(k => k.value === settings.includeAnswerKeyIn) || answerKeys[0]);
          setSelectedPageNumber(pageNumbers.find(p => p.value === settings.pageNumberDisplay) || pageNumbers[0]);

          setSelectedMargin(margins.find(m => m.value === settings.topMargin) || margins[1]);
          setIsIncludeStudentName(settings.includeStudentName);
          // setIsIncludeRandomizedTest(settings.includeRandomizedTests);
          // Set other states as needed based on the fetched settings
        } catch (error) {
          console.error('Failed to fetch print settings:', error);
          // Handle error (e.g., show error message)
        }
      };

      fetchPrintSettings();
    }
  }, [show]);

  const isMSWordOrPDFSelected = formatValue => {
    return formatValue === 'doc' || formatValue === 'pdf';
  };

  const handleFormatChange = format => {
    setSelectedFormat(format);
    setShowMSWordSetting(isMSWordOrPDFSelected(format.value));
  };

  const saveSettings = async () => {
    const payload = {
      multipleVersions: false, // isIncludeRandomizedTest
      numberOfVersions: 0, // assuming it's always 1
      scrambleOrder: 'Scramble question order',
      includeAreaForStudentResponse: selectedAnswerArea.value,
      includeAnswerKeyIn: selectedAnswerKey.value,
      includeAnwserFeedback: true,
      includeQuestionHints: true,
      topMargin: selectedMargin.value,
      bottomMargin: selectedMargin.value,
      leftMargin: selectedMargin.value,
      rightMargin: selectedMargin.value,
      headerSpace: '1.2',
      footerSpace: '1.2',
      font: 'Helvetica, Arial',
      fontSize: '12', // assuming this is a static value
      exportFileFormat: selectedFormat.value,
      includeRandomizedTests: false,
      includeStudentName: isIncludeStudentName,
      pageNumberDisplay: selectedPageNumber.value,
    };

    return savePrintsettings(payload);
  };

  const handleExport = async () => {
    setLoading(true);
    if (isSaveSettingsAsDefault) {
      try {
        await saveSettings();
        Toastify({
          type: 'success',
          message: intl.formatMessage({ id: 'success.exportTestSettings' }),
        });
      } catch (error) {
        Toastify({
          type: 'error',
          message: intl.formatMessage({ id: 'error.exportTestSettings' }) + error.message,
        });
      }
    }

    const options = {
      answerKey: selectedAnswerKey.value,
      answerArea: selectedAnswerArea.value,
      includeRandomizedTests: false,
      includeStudentName: isIncludeStudentName,
      saveSettings: false,
      margin: selectedMargin.value,
      pageNumberDisplay: selectedPageNumber.value,
    };
    exportTest(selectedTest.testId, selectedFormat.value, options)
      .then(blob => {
        const fileName = `${selectedTest.title.replace(/ /g, '_')}.${selectedFormat.fileExtension}`;
        downloadFile(blob, fileName);
        Toastify({
          type: 'success',
          message: intl.formatMessage({ id: 'success.documentExport' }),
        });
        handleCloseModal();
      })
      .catch(error => {
        Toastify({
          type: 'error',
          message: error instanceof Error ? error.message : error,
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Loader show={loading} />
      <Modal
        className="custom-modal-size export-modal-popup"
        show={show}
        onHide={handleCloseModal}
        centered
        backdrop={backdrop}
        keyboard={keyboard}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FormattedMessage id="exportTestsModalpopupTitle" />
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group as={Row}>
              <Col sm="6">
                <Form.Label column sm="6" style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                  <FormattedMessage id="exportFormatLabel" />
                </Form.Label>

                {exportFileFormats.map((format, index) => (
                  <Form.Check
                    type="radio"
                    label={format.text}
                    name="exportFormat"
                    id={`exportFormat-${index}`}
                    key={`exportFormat-${index}`}
                    checked={selectedFormat.value === format.value}
                    onChange={() => handleFormatChange(format)}
                  />
                ))}
              </Col>
              {showMSWordSetting && (
                <Col sm="6">
                  <Form.Label column sm="6" style={{ fontWeight: 'bold' }}>
                    <FormattedMessage id="answerAreaLabel" />
                  </Form.Label>
                  {answerAreas.map((area, index) => (
                    <Form.Check
                      type="radio"
                      label={area.text}
                      name="answerArea"
                      id={`answerArea-${index}`}
                      key={`answerArea-${index}`}
                      checked={selectedAnswerArea.value === area.value}
                      onChange={() => setSelectedAnswerArea(area)}
                      disabled={area.isDisabled}
                    />
                  ))}
                </Col>
              )}
            </Form.Group>

            {showMSWordSetting && (
              <>
                <hr />
                {/* Margins Section */}
                <Form.Group as={Row}>
                  <Col sm="6">
                    <Form.Label column sm="6" style={{ fontWeight: 'bold' }}>
                      <FormattedMessage id="marginsLabel" />
                    </Form.Label>

                    {margins.map((margin, index) => (
                      <Form.Check
                        type="radio"
                        label={margin.text}
                        name="margins"
                        id={`margin-${index}`}
                        key={`margin-${index}`}
                        checked={selectedMargin.value === margin.value}
                        onChange={() => setSelectedMargin(margin)}
                      />
                    ))}
                  </Col>
                  <Col sm="6">
                    <Form.Label column sm="6" style={{ fontWeight: 'bold' }}>
                      <FormattedMessage id="answerKeyLabel" />
                    </Form.Label>

                    {answerKeys.map((key, index) => (
                      <Form.Check
                        type="radio"
                        label={key.text}
                        name="answerKey"
                        id={`answerKey-${index}`}
                        key={`answerKey-${index}`}
                        checked={selectedAnswerKey.value === key.value}
                        onChange={() => setSelectedAnswerKey(key)}
                      />
                    ))}
                  </Col>
                </Form.Group>
                <hr />
                {/*  Answer Area Section */}
                <Form.Group as={Row}>
                  <Col sm="6">
                    <Form.Label column sm="6" style={{ fontWeight: 'bold' }}>
                      <FormattedMessage id="pageNumberLabel" />
                    </Form.Label>

                    {pageNumbers.map((number, index) => (
                      <Form.Check
                        type="radio"
                        label={number.text}
                        name="pageNumber"
                        id={`pageNumber-${index}`}
                        key={`pageNumber-${index}`}
                        checked={selectedPageNumber.value === number.value}
                        onChange={() => setSelectedPageNumber(number)}
                      />
                    ))}
                  </Col>
                  <Col sm="6">
                    <Form.Label column sm="6" style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                      <FormattedMessage id="labelsAndVersionsLabel" />
                    </Form.Label>

                    <Form.Check
                      type="checkbox"
                      label={intl.formatMessage({ id: 'exportTest.addStudentNameLabel&Space' })}
                      checked={isIncludeStudentName}
                      onChange={e => setIsIncludeStudentName(e.target.checked)}
                    />

                    {/* <Form.Check
                      type="checkbox"
                      label="Include all test versions"
                      checked={isIncludeRandomizedTest}
                      onChange={e => setIsIncludeRandomizedTest(e.target.checked)}
                    /> */}
                  </Col>
                </Form.Group>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Container fluid>
            <Row className="align-items-center">
              <Col xs={6}>
                <Form.Check
                  style={{ paddingLeft: '10px' }}
                  type="checkbox"
                  label="Save settings as default"
                  checked={isSaveSettingsAsDefault}
                  onChange={e => setIsSaveSettingsAsDefault(e.target.checked)}
                />
              </Col>
              <Col xs={6} className="action-buttons-container" style={{ paddingRight: '0px' }}>
                <Button variant="secondary" onClick={handleCloseModal} style={{ marginLeft: '10px' }}>
                  <FormattedMessage id="cancelButtonModalpopupExportText" />
                </Button>
                <Button variant="primary" onClick={handleExport}>
                  <FormattedMessage id="exportButtonModalpopupExportTextText" />
                </Button>
              </Col>
            </Row>
          </Container>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Modalpopupexport;
