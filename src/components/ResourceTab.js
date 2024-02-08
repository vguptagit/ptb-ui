import React from "react";
import { FormattedMessage } from "react-intl";
import { Nav } from "react-bootstrap";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const ResourceTab = () => {
    return (
        <div className="tab-container">
            <div>
                <h2 className="resource-tab p-1">
                    <FormattedMessage id="home.title" />
                </h2>
            </div>
            <div className="resource-tab-links">
            <Nav variant="tabs" defaultActiveKey="#/home/tests">
                    <OverlayTrigger placement="bottom" overlay={<Tooltip id="your-tests">Your Tests</Tooltip>}>
                        <Nav.Item>
                            <Nav.Link href="#/home/tests">Your Tests</Nav.Link>
                        </Nav.Item>
                    </OverlayTrigger>
                    <OverlayTrigger placement="bottom" overlay={<Tooltip id="your-questions">Your Questions</Tooltip>}>
                        <Nav.Item>
                            <Nav.Link href="#/home/questions">Your Questions</Nav.Link>
                        </Nav.Item>
                    </OverlayTrigger>
                    <OverlayTrigger placement="bottom" overlay={<Tooltip id="question-banks">Question Banks</Tooltip>}>
                        <Nav.Item>
                            <Nav.Link href="#/home/questionbanks">Question Banks</Nav.Link>
                        </Nav.Item>
                    </OverlayTrigger>
                    <OverlayTrigger placement="bottom" overlay={<Tooltip id="custom-question">Custom Questions</Tooltip>}>
                        <Nav.Item>
                            <Nav.Link href="#/home/customquestions">Custom Questions</Nav.Link>
                        </Nav.Item>
                    </OverlayTrigger>
                </Nav>
            </div>
        </div>
    );
};

export default ResourceTab;
