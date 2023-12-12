import React from "react";
import { FormattedMessage } from "react-intl";
import { Nav, NavItem, NavLink, Tab, TabPane } from "react-bootstrap";

const ResourceTab = () => {
    return (
        <>
            <h4>
                <FormattedMessage id="home.title" />
            </h4>

            <Tab.Container defaultActiveKey="#/home/tests">
                <Nav className="nav nav-tabs">
                    <NavItem>
                        <NavLink eventKey="#/home/tests">Your Tests</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink eventKey="#/home/questions">Your Questions</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink eventKey="#">Question Banks</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink eventKey="#" >Custom Question</NavLink>
                    </NavItem>
                </Nav>

                <Tab.Content>
                    <TabPane eventKey="#/home/tests">
                        <p>Tests</p>
                    </TabPane>
                    <TabPane eventKey="#/home/questions">
                        <p>Your Questions </p>
                    </TabPane>
                    <TabPane eventKey="#/questions banks">
                        <p>Content for questions banks goes here</p>
                    </TabPane>
                    <TabPane eventKey="#">
                        <p>Content for Custom Question goes here</p>
                    </TabPane>
                </Tab.Content>
            </Tab.Container>
        </>
    );
};

export default ResourceTab;
