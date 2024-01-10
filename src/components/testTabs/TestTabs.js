import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useAppContext } from '../../context/AppContext';
import Test from '../../entities/Test.Entity';
import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Nav from 'react-bootstrap/Nav';
import './TestTabs.css'; // Import the CSS file

const TestTabs = () => {
  const { tests, addTest, deleteTest, selectedTest, dispatchEvent } = useAppContext();
  const [showAdditionalButtons, setShowAdditionalButtons] = useState(false);
  const [ellipsisDropdownItems, setEllipsisDropdownItems] = useState([]);

  useEffect(() => {
    const ellipsisItems = tests.slice(4); // Items to be displayed in the ellipsis dropdown from the fifth tab onwards
    setShowAdditionalButtons(true);
    setEllipsisDropdownItems(ellipsisItems); 
  }, [tests]);

  const handleNodeSelect = (item) => {
    dispatchEvent('SELECT_TEST', item);
  };

  const handleAddNewTestTab = () => {
    const newTest = new Test();
    newTest.title = `Untitled ${tests.length + 1}`;
    addTest(newTest);
    dispatchEvent('SELECT_TEST', newTest);
  };

  const removeTab = (e, testSelected) => {
    e.preventDefault();
    deleteTest(testSelected);
   
  };

  const sampleButton = () => {
    alert("Button Clicked");
  };

  

  return (
    <div className="tab-container">
      <div className="d-flex justify-content-between">
        <h4 className="p-1">
          <FormattedMessage id="testtabs.title" />
        </h4>
        <div className="p-1">
          <Button className="btn-test mr-1">
            <i className="fa-solid fa-wand-magic-sparkles"></i>
            <FormattedMessage id="testtabs.testwizard" />
          </Button>
          {showAdditionalButtons && (
            <div className="d-flex justify-content-center">
              <Button className="btn-test mr-1">
                <FormattedMessage id="testtabs.print" />
              </Button>
              <Button className="btn-test mr-1">
                <FormattedMessage id="testtabs.export" />
              </Button>
            </div>
          )}
          <ButtonGroup>
            <DropdownButton id="dropdown-item-button" title="Save" className="btn-test mr-1">
              <Dropdown.Item href="#">
                <FormattedMessage id="testtabs.save" />
              </Dropdown.Item>
              <Dropdown.Item href="#">
                <FormattedMessage id="testtabs.saveas" />
              </Dropdown.Item>
            </DropdownButton>
            <div className="d-flex justify-content-center">
              <Button className="btn-test mr-1" disabled>
                <FormattedMessage id="testtabs.print" />
              </Button>
              <Button className="btn-test mr-1" disabled>
                <FormattedMessage id="testtabs.export" />
              </Button>
            </div>
          </ButtonGroup>
        </div>
      </div>

      <div className="tabs-and-buttons-container">
        <Nav variant="tabs">
          <Nav.Item>
            <Nav.Link href="#" onClick={handleAddNewTestTab} className='active'>
              <i className="fa-solid fa-plus"></i>
            </Nav.Link>
          </Nav.Item>
          {tests.map((test, index) => (
            index < 4 ? ( // Display tabs 1-4 in the main UI
              <Nav.Item key={test.id}>
                <Nav.Link
                  onClick={() => { handleNodeSelect(test) }}
                  className={selectedTest && selectedTest.id === test.id ? 'active' : ''}
                >
                  <div className='tab-label'>
                    <span>{test.title}</span>
                    <Button className="close-tab" variant="link" onClick={(e) => removeTab(e, test)}>
                      <i className="fas fa-times"></i>
                    </Button>
                  </div>
                </Nav.Link>
              </Nav.Item>
            ) : null
          ))}
          
          <Nav.Item className='three-dots-link'>
            <Dropdown alignRight>
              <Dropdown.Toggle id="dropdown-ellipsis" as={Nav.Link}>
              <i class="fa-solid fa-ellipsis"></i>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {ellipsisDropdownItems.map((test, index) => (
                  <Dropdown.Item
                    key={test.id}
                    onClick={() => handleNodeSelect(test)}
                  >
                    {test.title}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Nav.Item>
        </Nav>
      </div>
    </div>
  );
};

export default TestTabs;
