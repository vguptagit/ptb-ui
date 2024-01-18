// TestCreate.jsx
import React, { useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import QuestionsBanksTips from './testTabs/QuestionsBanksTips/QuestionsBanksTips';
import "./TestCreate.css"; // Import the CSS file

const TestCreate = () => {
    const { selectedTest } = useAppContext();

    console.log('TestCreate on load');

    useEffect(() => {
        console.log('TestCreate useEffect', selectedTest);
    }, [selectedTest]);

    return (
        <div className="test-container">
            <div>
                <label>
                    Test Name
                    <input type="text" name="title" placeholder="Enter Title" value={selectedTest.title} disabled />
                </label>
                <br />
                <QuestionsBanksTips />
            </div>
        </div>
    );
};

export default TestCreate;
