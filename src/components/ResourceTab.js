import React from "react";
import { FormattedMessage } from "react-intl";
import { Nav } from "react-bootstrap";
import { useLocation } from 'react-router-dom';

const ResourceTab = () => {
    const location = useLocation();
    const getActiveTab = () => {
        return "#"+location.pathname;
    }
    return (
        <div className="tab-container">
            <div>
                <h2 className="resource-tab p-1">
                    <FormattedMessage id="home.title" />
                </h2>
            </div>
            <div className="resource-tab-links">
            <Nav variant="tabs" defaultActiveKey={getActiveTab}>
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
        </div>
    );
};

export default ResourceTab;
