// TestCreate.jsx
import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import QuestionsBanksTips from './testTabs/QuestionsBanksTips/QuestionsBanksTips';
import { FormattedMessage } from 'react-intl';
import { Form } from "react-bootstrap";
import "./TestCreate.css"; // Import the CSS file

const TestCreate = () => {
    const { selectedTest } = useAppContext();
    const [showTextBox] = useState(true);

    console.log('TestCreate on load');

    useEffect(() => {
        console.log('TestCreate useEffect', selectedTest);
    }, [selectedTest]);

    return (
        <div className="test-container">
            <div>
                {showTextBox ? (
                    <div className="d-flex align-items-center p-1 addfolder-container" >
                        <div className="flex-grow-1 mr-21 d-flex align-items-center">
                            <div className="ml-2">
                                <FormattedMessage id="testName" />
                            </div>
                            <Form.Control
                                type="text"
                                name="title"
                                placeholder="Enter Title"
                                value={selectedTest.title}
                                className="rounded"
                            />
                        </div>
                    </div>
                ) : (null)}
                <QuestionsBanksTips />

            </div>
        </div>
    );
};

export default TestCreate;
