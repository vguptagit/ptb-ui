import React, { useEffect, useState } from 'react';
import './TestTabs.css'; // Import your CSS file
import { FormattedMessage } from 'react-intl';
import { useAppContext } from "../../context/AppContext";
import Test from "../../entities/Test.Entity";
import { Button } from 'react-bootstrap';
import QuestionBanksTips from './QuestionsBanksTips/QuestionsBanksTips';



const TestTabs = () => {
    const { tests, selectedTest, addTest, deleteTest } = useAppContext();
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
        console.log(selectedTest);
    }, [])
    return (
        <div className="tab-container">
            <div class="d-flex bd-highlight mb-3">
                <div class="me-auto p-2 bd-highlight"><h4><FormattedMessage id="testtabs.title" /></h4></div>

                <div class="p-2 bd-highlight">
                    <Button variant="primary">
                        <FormattedMessage id="profile.setting" />
                    </Button>
                    <Button variant="primary">
                        <FormattedMessage id="profile.setting" />
                    </Button>
                    <Button variant="primary">
                        <FormattedMessage id="profile.setting" />
                    </Button>
                    <Button variant="primary">
                        <FormattedMessage id="profile.setting" />
                    </Button>
                </div>
            </div>

            <div>
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
                <QuestionBanksTips />
            </div>

        </div>
    );
};

export default TestTabs;
