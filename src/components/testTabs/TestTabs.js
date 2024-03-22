import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useAppContext } from "../../context/AppContext";
import Test from "../../entities/Test.Entity";
import Button from "react-bootstrap/Button";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Nav from "react-bootstrap/Nav";
import "./TestTabs.css";
import QtiService from "../../utils/qtiService";
import {
  getFolderTests,
  saveMyQuestions,
  saveMyTest,
} from "../../services/testcreate.service";
import Toastify from "../common/Toastify";
import Modalpopup from "./Modalpopup";
import PrintTestModalpopup from "./PrintTest/PrintTestModalpopup";
import Modalpopupexport from "./Modalpopupexport";

const TestTabs = () => {
  const { tests, addTest, deleteTest, selectedTest, dispatchEvent, testName } =
    useAppContext();

  console.log("selectedtest", selectedTest);
  const [showAdditionalButtons, setShowAdditionalButtons] = useState(false);
  const [ellipsisDropdownItems, setEllipsisDropdownItems] = useState([]);
  const [selectedTestTitle, setSelectedTestTitle] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showModalExport, setShowModalExport] = useState(false);

  useEffect(() => {
    if (testName !== "") {
      // Do something with the testName
      console.log("Test name:", testName);
      handleEditTestTab(testName);
    }
  }, [testName]);

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
    setSelectedTestTitle(selectedTest ? selectedTest.title : "");
  }, [selectedTest]);

  const handleNodeSelect = (item) => {
    // Check if the selected tab is within the first four tabs
    const isWithinFirstFour = tests
      .slice(0, 4)
      .some((test) => test.id === item.id);

    if (isWithinFirstFour) {
      dispatchEvent("SELECT_TEST", item);
    } else {
      // Find the selected tab in the ellipsis dropdown items
      const ellipsisItem = ellipsisDropdownItems.find(
        (test) => test.id === item.id
      );
      if (ellipsisItem) {
        dispatchEvent("SELECT_TEST", item);
      }
    }
  };

  const handleAddNewTestTab = () => {
    const newTest = new Test();
    newTest.title = `Untitled ${tests.length + 1}`;

    // Check if there is only one tab and it is "Untitled 1"
    if (tests.length === 1 && tests[0].title === "Untitled 1") {
      // If it's "Untitled 1", add a closing tab for "Untitled 1"
      const untitled1Test = new Test();
      untitled1Test.title = "Untitled 1";
      addTest(untitled1Test);
    }

    // Check if "Untitled 2" tab exists, if not, add it
    const untitled2Exists = tests.some((test) => test.title === "Untitled 2");
    if (!untitled2Exists) {
      const untitled2Test = new Test();
      untitled2Test.title = "Untitled 2";
      addTest(untitled2Test);
    }

    // Add the new test
    addTest(newTest);

    // Select the new test
    dispatchEvent("SELECT_TEST", newTest);
  };

  const handleEditTestTab = (testName) => {
    // Check if the test already exists
    const existingTest = tests.find((test) => test.title === testName);
    if (existingTest) {
      // If the test exists, select it
      dispatchEvent("SELECT_TEST", existingTest);
    } else {
      // If the test does not exist, create a new one
      const newTest = new Test();
      newTest.title = testName;
      addTest(newTest);
    }
  };

  const removeTab = (e, testSelected) => {
    e.preventDefault();
    e.stopPropagation();

    if (!testSelected) {
      // If testSelected is undefined, handle the case gracefully
      console.error("Error: testSelected is undefined");
      return;
    }

    const index = tests.findIndex((test) => test.id === testSelected.id);
    const newSelectedTest =
      tests[index - 1] || // Try selecting the previous test
      tests[index + 1] || // If previous test doesn't exist, try selecting the next test
      tests.find((test) => test.title.startsWith("Untitled")); // If both previous and next tests don't exist, select an untitled test

    if (newSelectedTest) {
      dispatchEvent("SELECT_TEST", newSelectedTest);
    }

    deleteTest(testSelected);
  };

  const sampleButton = () => {
    alert("Button Clicked");
  };

  const handleSave = async (e, activeTest) => {
    let testItems = tests.filter((item) => item.id === activeTest.id);
    const test = testItems[0]; // This always exists
    console.log("Saving Test : ", test);
    // 1. Check for duplicate test
    // 2. Save questions
    // 3. Save tests
    if (!areQuestionsAvailable(test)) {
      Toastify({
        message:
          "There are no questions or one or more question(s) is(are) in edit state, Please add or save!",
        type: "warn",
      });
      return;
    }

    let isDuplicate = await isDuplicateTest(test);
    if (isDuplicate) {
      Toastify({
        message: "Test already exists with this name. Please save with another",
        type: "warn",
      });
    } else {
      // Proceed to save
      if (!test.title.trim()) {
        // If the test title is empty or only contains whitespace, set it to a default value
        test.title = `Untitled ${tests.length}`;
      }

      const folderGuid = JSON.parse(sessionStorage.getItem("selectedFolderId"));

      test.folderGuid = folderGuid;

      let questionBindings = await saveQuestions(test);
      saveTest(test, questionBindings);
    }
  };
  const saveTest = async (test, questionBindings) => {
    // Building the json to create the test.
    var testcreationdata = {
      metadata: {
        crawlable: "true",
      },
      body: {
        "@context":
          "http://purl.org/pearson/paf/v1/ctx/core/StructuredAssignment",
        "@type": "StructuredAssignment",
        assignmentContents: {
          "@contentType": "application/vnd.pearson.paf.v1.assignment+json",
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
      if (testResult) {
        Toastify({
          message: "Test has been saved successfully!",
          type: "success",
        });
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error saving Test:", error);
      if (error?.message?.response?.request?.status === 409) {
        Toastify({
          message: error.message.response.data.message,
          type: "error",
        });
      } else {
        Toastify({ message: "Failed to save Test", type: "error" });
      }
    }
    sessionStorage.removeItem("selectedFolderId");
  };

  const saveQuestions = async (test) => {
    // Save the Question Envelops & return the question bindings to attach to test
    // TODO - Add additional logic from legacy app as needed
    let questionEnvelops = [];
    let questionBindings = [];
    let userSettings = {};

    if (test.questions && test.questions.length > 0) {
      test.questions.forEach((qstn, index) => {
        questionEnvelops.push(buildQuestionEnvelop(qstn, userSettings));
      });
    }
    try {
      const questionResults = await saveMyQuestions(questionEnvelops);
      questionResults.forEach((qstnResult, index) => {
        questionBindings.push({
          guid: qstnResult.guid,
          activityFormat: "application/vnd.pearson.qti.v2p1.asi+xml",
          bindingIndex: index,
        });
      });
    } catch (error) {
      console.error("Error saving Questions:", error);
      if (error?.message?.response?.request?.status === 409) {
        Toastify({
          message: error.message.response.data.message,
          type: "error",
        });
      } else {
        Toastify({ message: "Failed to save Questions", type: "error" });
      }
    }
    return questionBindings;
  };

  const buildQuestionEnvelop = (qstn, userSettings) => {
    qstn.data = QtiService.getQtiXML(qstn);
    qstn.IsEdited = true; // TODO: Update this based on required functionality
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
      body: qstn.IsEdited ? qstn.data : null,
    };

    return QuestionEnvelop;
  };

  const buildQuestionMetadata = (qstn, userSettings) => {
    // TODO: Add logic to populate Question Extended Metadata
    var qstnExtMetadata = [];
    return qstnExtMetadata;
  };

  const isDuplicateTest = async (test) => {
    try {
      const folderTests = await getFolderTests(test.folderGuid);
      return folderTests.some(
        (folderTest) =>
          folderTest.title === test.title && folderTest.id !== test.id
      );
    } catch (error) {
      console.error("Error fetching folder tests:", error);
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = (e) => {
    setShowModal(!showModal);

    e.preventDefault();
    e.stopPropagation();
  };

  const handleClosePrintModal = (event) => {
    setShowPrintModal(!showPrintModal);

    event.preventDefault();
    event.stopPropagation();
  };

  const handleSaveAs = () => {
    console.log("handleSaveAs 1", showModal);
    if (!areQuestionsAvailable(selectedTest)) {
      Toastify({
        message:
          "There are no questions or one or more question(s) is(are) in edit state, Please add or save!",
        type: "warn",
      });
      return;
    }
    setShowModal(true);
    console.log("handleSaveAs 2", showModal);
  };

  const handleShowModalExport = () => {
    // console.log("handleSaveAs 1", showModal);
    // getPrintsettings().then( (data) => {

    //   console.log("print settings are as follows", data);
    // },
    // (error) => {
    //   console.log(error);
    // });
    setShowModalExport(true);
    //console.log("handleSaveAs 2", showModal);
  };

  const handlePrint = () => {
    // Open print modal
    if (!areQuestionsAvailable(selectedTest)) {
      Toastify({
        message:
          "There are no questions or one or more question(s) is(are) in edit state, Please add or save!",
        type: "warn",
      });
      return;
    }
    setShowPrintModal(true);
    console.log("handlePrint", showPrintModal);
  };

  const areQuestionsAvailable = (test) => {
    console.log("enable dropdown");
    return (
      test &&
      test.questions.length > 0 &&
      !test.questions.find((item) => item.qtiModel.EditOption === true)
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
            <DropdownButton
              id="dropdown-item-button"
              title="Save"
              className="btn-test mb-1 mb-sm-0 mr-sm-1 mr-1"
            >
              <Dropdown.Item
                href="#"
                onClick={(e) => handleSave(e, selectedTest)}
              >
                <FormattedMessage id="testtabs.save" />
              </Dropdown.Item>
              <Dropdown.Item
                href="#"
                onClick={(e) => handleSaveAs(e, selectedTest)}
              >
                <Modalpopup
                  show={showModal}
                  handleCloseModal={handleCloseModal}
                  selectedTest={selectedTest}
                  handleSave={handleSave}
                />
                <FormattedMessage id="testtabs.saveas" />
              </Dropdown.Item>
            </DropdownButton>

            <Button
              id="dropdown-item-button"
              title="Print"
              className="btn-test mb-1 mb-sm-0 mr-sm-1 mr-1"
              onClick={(e) => handlePrint(e)}
            >
              <PrintTestModalpopup
                width="80%"
                show={showPrintModal}
                handleClosePrintModal={handleClosePrintModal}
              />
              <FormattedMessage id="testtabs.print" />
            </Button>

            <Button
              className="btn-test mt-1 mt-sm-0"
              onClick={handleShowModalExport}
            >
              <FormattedMessage id="testtabs.export" />
            </Button>
            <Modalpopupexport
              width="80%"
              show={showModalExport}
              handleCloseModal={() => setShowModalExport(false)}
              backdrop="static"
              keyboard={false}
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
              className={"active custom-add-new-test"}
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
                  className={
                    selectedTest && selectedTest.id === test.id
                      ? "active floatLeft"
                      : "floatLeft"
                  }
                  id="test-tabs-navlink"
                >
                  <div className="tab-label">
                    <div className="test-title floatLeft" title={test.title}>
                      {test.title}
                    </div>
                    {/* Always render the close button */}
                    {tests.length > 1 && (
                      <div className="floatRight">
                        <Button
                          className="close-tab"
                          aria-label="close"
                          aria-roledescription=" "
                          variant="link"
                          onClick={(e) => removeTab(e, test)}
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
                              onClick={(e) => removeTab(e, test)}
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
