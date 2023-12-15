import React from "react";
import { FormattedMessage } from "react-intl";
import { Nav } from "react-bootstrap";

const ResourceTab = () => {
    return (
        <div className="tab-container">
            <h4>
                <FormattedMessage id="home.title" />
            </h4>
            <Nav variant="tabs" defaultActiveKey="#/home/tests">
                <Nav.Item>
                    <Nav.Link href="#/home/tests">Your Tests</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="#/home/questions">Your Questions</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="#/home/questionbanks">Question Banks</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="#/home/customquestions">Custom Questions</Nav.Link>
                </Nav.Item>
            </Nav>
        </div>
    );
};

export default ResourceTab;
