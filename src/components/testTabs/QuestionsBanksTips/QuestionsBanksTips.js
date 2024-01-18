import React from 'react';
import { FormattedMessage } from 'react-intl';
import "./QuestionBanksTips.css";

const QuestionBanksTips = () => {
    return (
        <div className="question-banks-tips-container">
            <div className="jumbotron">
                <i className="far fa-lightbulb light-orange"></i>
                
                <div className="container">
                    <p className="bold-text"><FormattedMessage id="questionbanks.instructions.edit" /></p>
                    <p className="bold-text"><FormattedMessage id="questionbanks.instructions.create" /></p>
                    <p className="bold-text"><FormattedMessage id="questionbanks.instructions.automatic" /></p>
                </div>
            </div>
        </div>
    );
};

export default QuestionBanksTips;
