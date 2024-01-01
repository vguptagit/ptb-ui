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
import QuestionsBanksTips from './QuestionsBanksTips/QuestionsBanksTips';

const TestTabs = () => {
    const { tests, addTest, deleteTest } = useAppContext();
    const [newTest, setNewTest] = useState(new Test());

    const handleAddNewTestTab = () => {
        const testTab = new Test();
        testTab.title = `Untitled ${tests.length + 1}`;
        if (testTab.title) {
            addTest(testTab);
            setNewTest(new Test());
        }
    };

    const [tabs, setTabs] = useState([{ id: 1, label: 'Untitled' }]);
    const [nextTabId, setNextTabId] = useState(2);

    const addTab = () => {
        const newTabs = [...tabs, { id: nextTabId, label: `Untitled ${nextTabId}` }];
        setTabs(newTabs);
        setNextTabId(nextTabId + 1);
    };

    const removeTab = (e, testSelected) => {
        e.preventDefault();
        deleteTest(testSelected);
    };

    useEffect(() => {
        setTabs(tests);
    }, [tests]);

    return (

        <div className="tab-container">
            <div className="d-flex justify-content-between">
                <h4 className="p-1">
                    <FormattedMessage id="testtabs.title" />
                </h4>
                <div className="p-1">
                    <Button className="btn-test">
                        <i className="fa-solid fa-wand-magic-sparkles"></i>
                        <FormattedMessage id="testtabs.testwizard" />
                    </Button>
                    <ButtonGroup>
                        <DropdownButton id="dropdown-item-button" title="Save" className="btn-test">
                            <Dropdown.Item href="#">
                                <FormattedMessage id="testtabs.save" />
                            </Dropdown.Item>
                            <Dropdown.Item href="#">
                                <FormattedMessage id="testtabs.saveas" />
                            </Dropdown.Item>
                        </DropdownButton>
                        <div className="d-flex justify-content-center">
                            <Button className="btn-test">
                                <FormattedMessage id="testtabs.print" />
                            </Button>
                            <Button className="btn-test">
                                <FormattedMessage id="testtabs.export" />
                            </Button>
                        </div>
                    </ButtonGroup>
                </div>
            </div>


            <Nav variant="tabs" defaultActiveKey={`#/${tabs.length > 0 ? tabs[0].id : ''}`}>
                <Nav.Item>
                    <Nav.Link href="#" onClick={handleAddNewTestTab}>
                        +
                    </Nav.Link>
                </Nav.Item>
                {tests.map(test => (
                    <Nav.Item key={test.id}>
                        <Nav.Link  className={test.id === tabs.length ? 'active' : ''}>
                            <div className={`tab-label${test.id === tabs.length ? ' active' : ''}`}>
                                <span>{test.title}</span>
                                <Button className="close-tab" onClick={e => removeTab(e, test)}>
                                    <i className="fas fa-times"></i>
                                </Button>
                            </div>
                        </Nav.Link>
                    </Nav.Item>
                ))}
            </Nav>
            

            {/* Place the fragment here */}
            <div>
                <>
                    <QuestionsBanksTips />
                </>
            </div>

        </div>
    );
};


export default TestTabs;
