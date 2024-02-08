import React, { useEffect } from 'react';
import Testing from '../components/common/Testing'
import QuestionFolder from "../components/AddQuestionFolder";

const Questions = () => {
    useEffect(() => {
        document.title = "Your Questions";
      }, []);
    return (
        <>
            <QuestionFolder/>
        </>
    );
}
export default Questions;