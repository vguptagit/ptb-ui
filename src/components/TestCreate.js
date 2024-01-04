import React, { useEffect, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useAppContext } from "../context/AppContext";
import Test from "../entities/Test.Entity";
import QuestionsBanksTips from './testTabs/QuestionsBanksTips/QuestionsBanksTips';

const TestCreate = () => {
    const { dispatchEvent, selectedTest } = useAppContext();
    const [newTest, setNewTest] = useState(new Test());
    const inputRef = useRef(null);

    console.log('TestCreate on load');

    // Step 1: Initialize State
    const [formData, setFormData] = useState(new Test());
    // Step 2: Handle Form Input Changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Step 4: Handle Form Submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // You can now use the formData state or send it to a server
        console.log('Form data submitted:', formData);
        if (formData.title) {
            dispatchEvent("ADD_TEST", { test: formData });
            setNewTest(new Test());
        }
    };
    useEffect(() => {
        console.log('TestCreate useEffect', selectedTest);
    }, [])
    return (
        <div className="test-container p-1">
            <div>
                <h3>
                    Test Create
                </h3>
            </div>
            <div>
                {selectedTest.title}
                <form onSubmit={handleSubmit}>
                    <label>
                        Title:
                        {/* <input type="text" name="title" value={selectedTest.title} onChange={handleInputChange} /> */}
                        <input type="text" name="title" value={selectedTest.title} onChange={handleInputChange} ref={inputRef} />
                    </label>
                     
                    <br />
                    <button type="submit" className="m-1">Submit</button>
                </form>
                <QuestionsBanksTips />
            </div>
        </div>
    );
};

export default TestCreate;
