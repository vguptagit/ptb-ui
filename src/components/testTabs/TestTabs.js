import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useAppContext } from '../../context/AppContext';
import Test from '../../entities/Test.Entity';
import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Nav from 'react-bootstrap/Nav';
import './TestTabs.css';
import QtiService from '../../utils/qtiService';
import { getFolderTests, saveMyQuestions, saveMyTest } from '../../services/testcreate.service';
import Toastify from '../common/Toastify';
import Modalpopup from './Saveasmodalpopup';
import PrintTestModalpopup from './PrintTest/PrintTestModalpopup';
import Modalpopupexport from './Modalpopupexport';
import deepEqual from 'deep-equal';

const TestTabs = () => {
  const {
    tests,
    addTest,
    deleteTest,
    selectedTest,
    dispatchEvent,
    editTest,
    setSelectedTest,
    fetchUserFolders,
    setEditTestHighlight,
    setSelectedViewTest,
    isMigratedTests,
    setIsMigratedTests,
  } = useAppContext();

  console.log('selectedtest', selectedTest);
  const [showAdditionalButtons, setShowAdditionalButtons] = useState(false);
  const [ellipsisDropdownItems, setEllipsisDropdownItems] = useState([]);
  const [selectedTestTitle, setSelectedTestTitle] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showModalExport, setShowModalExport] = useState(false);
  const [setTests] = useState([{ title: '' }]);

  useEffect(() => {
    if (editTest !== null) {
      handleEditTestTab(editTest);
    }
  }, [editTest]);

  useEffect(() => {
    if (selectedTest && selectedTest.title) {
      setIsMigratedTests(selectedTest.title.startsWith('Untitled ') || !isMigratedTests);
    }
  }, [selectedTest]);

  useEffect(() => {
    const ellipsisItems = tests?.slice(4);
    setShowAdditionalButtons(true);
    setEllipsisDropdownItems(ellipsisItems);

    // Select the first "Untitled" tab by default if no test is already selected
    // if (
    //   !selectedTest ||
    //   !selectedTest.title ||
    //   !selectedTest.title.startsWith("Untitled")
    // ) {
    //   const untitledTest = tests?.find(
    //     (test) => test.title && test.title.startsWith("Untitled")
    //   );
    //   if (untitledTest) {
    //     dispatchEvent("SELECT_TEST", untitledTest);
    //   } else if (tests && tests.length > 0) {
    //     dispatchEvent("SELECT_TEST", tests[0]);
    //   }
    // }
  }, [tests, selectedTest, dispatchEvent]);

  useEffect(() => {
    // Update the selectedTestTitle when the selectedTest changes
    setSelectedTestTitle(selectedTest ? selectedTest.title : '');
  }, [selectedTest]);

  // const handleTitleChange = (e, index) => {
  //   const updatedTests = [...tests];
  //   const newTitle = e.target.value.trim(); // Trim whitespace from the input
  //   updatedTests[index].title = newTitle;
  //   if (newTitle === '') {
  //     // If the new title is empty, set background color to red
  //     e.target.style.backgroundColor = 'red';
  //   } else {
  //     // If the new title is not empty, set background color to transparent
  //     e.target.style.backgroundColor = 'transparent';
  //   }
  //   setTests(updatedTests);
  // };

  const handleNodeSelect = item => {
    // Check if the selected tab is within the first four tabs
    const isWithinFirstFour = tests.slice(0, 4).some(test => test.id === item.id);

    if (isWithinFirstFour) {
      dispatchEvent('SELECT_TEST', item);
    } else {
      // Find the selected tab in the ellipsis dropdown items
      const ellipsisItem = ellipsisDropdownItems.find(test => test.id === item.id);
      if (ellipsisItem) {
        dispatchEvent('SELECT_TEST', item);
      }
    }
  };

  const handleAddNewTestTab = () => {
    const newTest = new Test();
    newTest.title = `Untitled ${tests.length + 1}`;

    // Check if there is only one tab and it is "Untitled 1"
    if (tests.length === 1 && tests[0].title === 'Untitled 1') {
      // If it's "Untitled 1", add a closing tab for "Untitled 1"
      const untitled1Test = new Test();
      untitled1Test.title = 'Untitled 1';
      addTest(untitled1Test);
    }

    // Check if "Untitled 2" tab exists, if not, add it
    const untitled2Exists = tests.some(test => test.title === 'Untitled 2');
    if (!untitled2Exists) {
      const untitled2Test = new Test();
      untitled2Test.title = 'Untitled 2';
      addTest(untitled2Test);
    }

    // Add the new test
    addTest(newTest);

    // Select the new test
    dispatchEvent('SELECT_TEST', newTest);
  };

  const handleEditTestTab = editTest => {
    const existingTest = tests.find(test => test.id === editTest?.id);
    if (existingTest) {
      // If the test exists, select it
      dispatchEvent('SELECT_TEST', existingTest);
    } else {
      // If the test does not exist, create a new one
      const newTest = new Test();
      newTest.title = editTest?.text;
      newTest.id = editTest?.id;
      addTest(newTest);
    }
  };

  const removeTab = (e, testSelected) => {
    e.preventDefault();
    e.stopPropagation();

    if (!testSelected) {
      // If testSelected is undefined, handle the case gracefully
      console.error('Error: testSelected is undefined');
      return;
    }

    const index = tests.findIndex(test => test.id === testSelected.id);
    const newSelectedTest =
      tests[index - 1] || // Try selecting the previous test
      tests[index + 1] || // If previous test doesn't exist, try selecting the next test
      tests.find(test => test.title.startsWith('Untitled')); // If both previous and next tests don't exist, select an untitled test

    if (newSelectedTest) {
      dispatchEvent('SELECT_TEST', newSelectedTest);
    }

    deleteTest(testSelected);
    setEditTestHighlight(selectedTest.id);
    setSelectedViewTest(null);
  };

  const sampleButton = () => {
    alert('Button Clicked');
  };

  const handleSave = async (e, activeTest, folderId, newTestName) => {
    let testItems = tests.filter(item => item.id === activeTest.id);
    const test = testItems[0]; // This always exists
    let buttonName = e.target.name;
    console.log(buttonName + ' Saving Test : ', test);
    // 1. Check for duplicate test
    // 2. Save questions
    // 3. Save tests
    if (!areQuestionsAvailable(test)) {
      Toastify({
        message: 'There are no questions or one or more question(s) is(are) in edit state, Please add or save!',
        type: 'warn',
      });
      return;
    }

    // Folder Id will be passed from save As modal popup
    if (folderId) {
      test.folderGuid = folderId;
    } else {
      const folderGuid = JSON.parse(sessionStorage.getItem('selectedFolderId'));
      test.folderGuid = folderGuid;
    }

    if (buttonName === 'saveAs') {
      test.title = activeTest.title;
    }

    let isduplicateTest = await isDuplicateTest(buttonName, test);
    // When duplicate method fails because of server error dont proceed with test save
    if (isduplicateTest === null) {
      Toastify({
        message: 'Something went wrong',
        type: 'Error',
      });
      return;
    } else if (isduplicateTest) {
      Toastify({
        message: 'Test already exists with this name. Please save with another',
        type: 'warn',
      });
    } else {
      // Proceed to save when its update or new test
      if (!test.title.trim()) {
        // If the test title is empty or only contains whitespace, set it to a default value
        Toastify({
          message: 'Test name is empty. Please give test name',
          type: 'warn',
        });
        return;
      }
      // Reset Guid of test if its save As
      if (buttonName === 'saveAs') {
        test.testId = null;
      }
      let questionBindings = await saveQuestions(test);
      if (questionBindings && questionBindings.length != 0) {
        saveTest(test, questionBindings);
      }
    }
  };

  const saveTest = async (test, questionBindings) => {
    // Building the json to create the test.
    var testcreationdata = {
      metadata: {
        crawlable: 'true',
      },
      body: {
        '@context': 'http://purl.org/pearson/paf/v1/ctx/core/StructuredAssignment',
        '@type': 'StructuredAssignment',
        assignmentContents: {
          '@contentType': 'application/vnd.pearson.paf.v1.assignment+json',
          binding: [],
        },
      },
    };

    testcreationdata.body.title = test.title;
    testcreationdata.body.guid = null; // TODO : Set this value

    // TODO: Update this logic based on understanding of what testID represents
    if (test.testId != null) {
      testcreationdata.metadata = test.metadata;
      testcreationdata.metadata.guid = test.testId;
    }

    testcreationdata.metadata.title = test.title;
    testcreationdata.body.assignmentContents.binding = questionBindings;
    try {
      let testResult = await saveMyTest(testcreationdata, test.folderGuid);
      // update GUID the saved test object
      if (testResult) {
        test.testId = testResult.guid;
        test.metadata.guid = testResult.guid;

        // Updating selected test with testID
        dispatchEvent('UPDATE_SELECTED_TEST', { test });

        Toastify({
          message: 'Test has been saved successfully!',
          type: 'success',
        });
        fetchUserFolders();
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error saving Test:', error);
      if (error?.message?.response?.request?.status === 409) {
        Toastify({
          message: error.message.response.data.message,
          type: 'error',
        });
      } else {
        Toastify({ message: 'Failed to save Test', type: 'error' });
      }
    }
    sessionStorage.removeItem('selectedFolderId');
  };

  const saveQuestions = async test => {
    // Save the Question Envelops & return the question bindings to attach to test
    // TODO - Add additional logic from legacy app as needed
    let questionEnvelops = [];
    let questionBindings = [];
    let userSettings = {};

    if (test.questions && test.questions.length > 0) {
      const uniqueQuestions = [];
      test.questions.forEach((qstn) => {
        const isDuplicate = uniqueQuestions.some(
          (uniqueQstn) =>
            JSON.stringify(uniqueQstn.qtiModel) ===
            JSON.stringify(qstn.qtiModel)
        );

        if (!isDuplicate) {
          uniqueQuestions.push(qstn);
          questionEnvelops.push(buildQuestionEnvelop(qstn, userSettings));
        } else {
          // If duplicate, show an alert to the user
          alert("Are you sure you want to save the same question again?");
          uniqueQuestions.push(qstn);
          questionEnvelops.push(buildQuestionEnvelop(qstn, userSettings));
        }
      });
    }
    try {
      const questionResults = await saveMyQuestions(questionEnvelops);
      questionResults.forEach((qstnResult, index) => {
        questionBindings.push({
          guid: qstnResult.guid,
          activityFormat: 'application/vnd.pearson.qti.v2p1.asi+xml',
          bindingIndex: index,
        });
        // update question data if question save is success
        test.questions[index].guid = qstnResult.guid;
        test.questions[index].masterData = JSON.parse(JSON.stringify(test.questions[index].qtiModel));
      });
    } catch (error) {
      console.error('Error saving Questions:', error);
      if (error?.message?.response?.request?.status === 409) {
        Toastify({
          message: error.message.response.data.message,
          type: 'error',
        });
      } else {
        Toastify({ message: 'Failed to save Test', type: 'error' });
      }
    }
    return questionBindings;
  };

  const buildQuestionEnvelop = (qstn, userSettings) => {
    qstn.data = QtiService.getQtiXML(qstn);
    qstn.IsEdited = false;
    if (!deepEqual(qstn.masterData, qstn.qtiModel)) {
      qstn.IsEdited = true;
    }
    var qstnExtMetadata = buildQuestionMetadata(qstn, userSettings);
    var QuestionEnvelop = {
      metadata: {
        guid: qstn.IsEdited ? null : qstn.guid,
        title: qstn.title,
        description: qstn.description,
        quizType: qstn.quizType,
        subject: qstn.subject,
        timeRequired: qstn.timeRequired,
        crawlable: qstn.crawlable,
        keywords: qstn.keywords,
        versionOf: qstn.versionOf,
        version: qstn.version,
        extendedMetadata: qstnExtMetadata,
      },
      body: qstn.data,
    };

    return QuestionEnvelop;
  };

  const buildQuestionMetadata = (qstn, userSettings) => {
    // TODO: Add logic to populate Question Extended Metadata
    var qstnExtMetadata = [];
    return qstnExtMetadata;
  };

  const isDuplicateTest = async (buttonName, test) => {
    let testStatus = await duplicateTestStatus(test);
    //status 0 = No duplicates.
    //status 1 = Duplicate Title but guid is different. Prevent save
    //status 2 = Duplicate Guid but title is different. So set testId to empty to save new test
    //status 3 = both guid & title are same (Update).
    if (testStatus === 0) {
      return false;
    } else if (testStatus === 1) {
      return true;
    } else if (testStatus === 2) {
      if (buttonName && buttonName === 'saveAs') {
        test.testId = null;
      }
      return false;
    } else if (testStatus === 3) {
      if (buttonName && buttonName === 'saveAs') {
        return true; // prevent update during save As
      } else {
        return false;
      }
    }

    return null;
  };

  const duplicateTestStatus = async test => {
    try {
      var isDuplicate = 0;
      const folderTests = await getFolderTests(test.folderGuid);
      // If test.title === folderTest.title && test.testId == folderTest.guid, this test is being updated
      // if only test.title match OR if only Guid match, then its duplicate
      // if both does not match then its new test save
      for (const folderTest of folderTests) {
        if (folderTest.title == test.title && folderTest.guid == test.testId) {
          isDuplicate = 3; // Both GUID & Title match
          break;
        } else if (folderTest.guid == test.testId) {
          isDuplicate = 2; // Same GUID with different title
          break;
        } else if (folderTest.title == test.title) {
          isDuplicate = 1; // Same title with different GUID
          break;
        }
      }
      console.log('Duplicate test status : ', isDuplicate);
      return isDuplicate;
    } catch (error) {
      console.error('Error fetching folder tests:', error);
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = e => {
    setShowModal(!showModal);

    e?.preventDefault();
    e?.stopPropagation();
  };

  // const handleClosePrintModal = (event) => {
  //   setShowPrintModal(!showPrintModal);
  //   event.preventDefault();
  //   event.stopPropagation();
  // };

  const handleSaveAs = () => {
    if (!areQuestionsAvailable(selectedTest)) {
      Toastify({
        message: 'There are no questions or one or more question(s) is(are) in edit state, Please add or save!',
        type: 'warn',
      });
      return;
    }
    setShowModal(true);
    console.log('handleSaveAs 2', showModal);
  };

  const handleShowModalExport = () => {
    if (selectedTest.testId) {
      setShowModalExport(true);
    } else {
      Toastify({
        type: 'warn',
        message: 'Please save the test before exporting!',
      });
    }
  };

  const handlePrint = () => {
    // Open print modal
    if (!areQuestionsAvailable(selectedTest)) {
      Toastify({
        message: 'There are no questions or one or more question(s) is(are) in edit state, Please add or save!',
        type: 'warn',
      });
      return;
    }
    setShowPrintModal(true);
  };

  const areQuestionsAvailable = test => {
    return (
      test &&
      test.questions.length > 0 &&
      !test.questions.find(item => item.qtiModel && item.qtiModel.EditOption === true)
    );
  };

  return (
    <div className="tab-container">
      <div className="d-flex flex-column flex-sm-row justify-content-between">
        <h4 className="p-1">
          <FormattedMessage id="testtabs.title" />
        </h4>
        <div className="p-1 d-flex flex-column flex-sm-row align-items-start align-items-sm-center">
          <Button className="btn-test mr-1" id="btn-test-wizard">
            <i className="fa-solid fa-wand-magic-sparkles"></i>
            <FormattedMessage id="testtabs.testwizard" />
          </Button>

          <div className="d-flex flex-column flex-sm-row align-items-start">
            <DropdownButton id="dropdown-item-button" title="Save" className="btn-test mb-1 mb-sm-0 mr-sm-1 mr-1">
              <Dropdown.Item
                href="#"
                onClick={e => handleSave(e, selectedTest)}
                // disabled={
                //   isMigratedTests && !selectedTest.title.startsWith("Untitled ")
                // }
              >
                <FormattedMessage id="testtabs.save" />
              </Dropdown.Item>
              <Dropdown.Item href="#" onClick={e => handleSaveAs(e, selectedTest)}>
                <FormattedMessage id="testtabs.saveas" />
              </Dropdown.Item>
            </DropdownButton>

            <Button id="dropdown-item-button" className="btn-test mb-1 mb-sm-0 mr-sm-1 mr-1" onClick={handlePrint}>
              <FormattedMessage id="testtabs.print" />
            </Button>
            <PrintTestModalpopup width="80%" show={showPrintModal} handleCloseModal={() => setShowPrintModal(false)} />

            <Button className="btn-test mt-1 mt-sm-0" onClick={handleShowModalExport}>
              <FormattedMessage id="testtabs.export" />
            </Button>
            <Modalpopupexport
              width="80%"
              show={showModalExport}
              selectedTest={selectedTest}
              handleCloseModal={() => setShowModalExport(false)}
            />
            <Modalpopup
              show={showModal}
              handleCloseModal={handleCloseModal}
              selectedTest={selectedTest}
              handleSave={handleSave}
            />
          </div>
        </div>
      </div>

      <div className="tabs-and-buttons-container">
        <Nav variant="tabs">
          <Nav.Item>
            <Nav.Link
              href="#"
              onClick={handleAddNewTestTab}
              className={'active custom-add-new-test'}
              aria-label="Add New Test"
            >
              <i className="fa-solid fa-plus"></i>
            </Nav.Link>
          </Nav.Item>
          <span className="tab-separator"> </span>
          {tests.map((test, index) =>
            index < 4 ? (
              <Nav.Item key={test.id}>
                <Nav.Link
                  onClick={() => {
                    handleNodeSelect(test);
                  }}
                  className={selectedTest && selectedTest.id === test.id ? 'active floatLeft' : 'floatLeft'}
                  id="test-tabs-navlink"
                >
                  <div className="tab-label">
                    <div className="test-title floatLeft" title={test.title}>
                      {test.title.trim() !== '' ? test.title : 'Untitled'}
                    </div>
                    {/* Always render the close button */}
                    {tests.length > 1 && (
                      <div className="floatRight">
                        <Button
                          className="close-tab"
                          aria-label="close"
                          aria-roledescription=" "
                          variant="link"
                          onClick={e => removeTab(e, test)}
                        >
                          <i className="fas fa-times"></i>
                        </Button>
                      </div>
                    )}
                  </div>
                </Nav.Link>
              </Nav.Item>
            ) : null
          )}
          {tests.length > 4 && (
            <Nav.Item className="three-dots-link">
              <Dropdown alignRight>
                <Dropdown.Toggle id="dropdown-ellipsis" as={Nav.Link}>
                  <i className="fa-solid fa-ellipsis"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {ellipsisDropdownItems.map((test, index) => (
                    <Dropdown.Item onClick={() => handleNodeSelect(test)}>
                      <div className="tab-label" id="tab-label-dropdown">
                        <div className="test-title" title={test.title}>
                          {test.title}
                        </div>
                        {/* Always render the close button */}
                        {tests.length > 1 && (
                          <div className="close-tab-wrapper">
                            <Button
                              className="close-tab"
                              aria-label="close"
                              id="close-tab-dropdown"
                              variant="link"
                              onClick={e => removeTab(e, test)}
                            >
                              <i className="fas fa-times"></i>
                            </Button>
                          </div>
                        )}
                      </div>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Nav.Item>
          )}
        </Nav>
      </div>
    </div>
  );
};

export default TestTabs;
