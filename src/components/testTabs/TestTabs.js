import React, { useEffect, useState } from 'react';
import './TestTabs.css'; // Import your CSS file
import { FormattedMessage } from 'react-intl';
import { useAppContext } from "../../context/AppContext";
import Test from "../../entities/Test.Entity";
import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import NavDropdown from "react-bootstrap/NavDropdown";

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
        deleteTest(testSelected)
        // const updatedTabs = tests.filter(test => test.id !== testSelected.id);

        // setTabs(updatedTabs);
    };

    useEffect(() => {
        setTabs(tests);

    }, [])
    return (
        <div className="tab-container">
            <div className="d-flex justify-content-between">
                <h4 className="p-1"><FormattedMessage id="testtabs.title" /></h4>
                <div className="p-1">
                    <Button className="btn-test"><i class="fa-solid fa-wand-magic-sparkles"></i><FormattedMessage id="testtabs.testwizard" /></Button>
                    <ButtonGroup>
                    <DropdownButton id="dropdown-item-button" title="Save" className="btn-test">
                        <Dropdown.Item href="#"><FormattedMessage id="testtabs.save" /></Dropdown.Item>
                        <Dropdown.Item href="#"><FormattedMessage id="testtabs.saveas" /></Dropdown.Item>
                    </DropdownButton>
                        <div className="d-flex justify-content-center">
                            <Button className="btn-test"><FormattedMessage id="testtabs.print" /></Button>
                            <Button className="btn-test"><FormattedMessage id="testtabs.export" /></Button>
                        </div>
                    </ButtonGroup>
                </div>
            </div>
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <button className="nav-link add-tab" onClick={handleAddNewTestTab}>+</button>
                </li>
                {tests.map(test => (
                    <li className="nav-item" key={test.id}>
                        <div className={`tab-label${test.id === tabs.length ? ' active' : ''}`}>
                            <span>{test.title}</span>
                            <button className="close-tab" onClick={(e) => removeTab(e, test)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TestTabs;
