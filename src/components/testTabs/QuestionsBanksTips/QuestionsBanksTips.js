import React from 'react';
import { FormattedMessage } from 'react-intl';
import "./QuestionBanksTips.css";

const QuestionBanksTips = () => {
    return (
        <div className="question-banks-tips-container">
            <div className="jumbotron" tabindex="1">
                <i className="far fa-lightbulb light-orange" aria-label='bulb icon' tabindex="1"></i>
                
                <div className="qbcontainer">
                    <p className="bold-text"><FormattedMessage id="questionbanks.instructions.edit" /></p>
                    <p className="bold-text"><FormattedMessage id="questionbanks.instructions.create" /></p>
                    <p className="bold-text"><FormattedMessage id="questionbanks.instructions.automatic" /></p>
                </div>
            </div>
        </div>
    );
};


export default QuestionBanksTips;