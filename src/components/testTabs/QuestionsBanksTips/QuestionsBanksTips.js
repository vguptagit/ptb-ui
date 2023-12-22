import React from 'react';
import { FormattedMessage } from 'react-intl';
import "./QuestionBanksTips.css";

const QuestionBanksTips = () => {
    return (
        <div className="question-banks-tips-container">
            <h5>
                <i className="far fa-lightbulb light-orange"></i>
                <FormattedMessage id="questionbanks.tips" />
            </h5>

            <div className="container">
                <h6><FormattedMessage id="questionbanks.instructions.edit" /></h6>
                <h6><FormattedMessage id="questionbanks.instructions.create" /></h6>
                <h6><FormattedMessage id="questionbanks.instructions.automatic" /></h6>
            </div>
        </div>
    );
};

export default QuestionBanksTips;

