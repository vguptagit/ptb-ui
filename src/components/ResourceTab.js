import React from "react";
import { useState, useEffect } from 'react';
import { FormattedMessage } from "react-intl";
import { Nav } from "react-bootstrap";
import { useLocation } from 'react-router-dom';

const ResourceTab = () => {
    const location = useLocation();
    const [activePath, setActivePath] = useState();
    useEffect(() => {
        setActivePath(location.pathname);
    }, [location]);
    return (
        <div className="tab-container">
            <div>
                <h2 className="resource-tab p-1">
                    <FormattedMessage id="home.title" />
                </h2>
            </div>
            <div className="resource-tab-links">
                <Nav variant="tabs" activeKey={"#" + activePath}>
                    <Nav.Item>
                        <Nav.Link href="#/home/tests">
                            <FormattedMessage id="yourTestsResourceTab" />
                        </Nav.Link>
                    </Nav.Item>

                    <Nav.Item>
                        <Nav.Link href="#/home/questions">
                            <FormattedMessage id="yourQuestionsResourceTab" />
                        </Nav.Link>
                    </Nav.Item>

                    <Nav.Item>
                        <Nav.Link href="#/home/questionbanks">
                            <FormattedMessage id="questionBanksResourceTab" />
                        </Nav.Link>
                    </Nav.Item>

                    <Nav.Item>
                        <Nav.Link href="#/home/customquestions">
                            <FormattedMessage id="customQuestionsResourceTab" />
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
            </div>
        </div>
    );
};

export default ResourceTab;
