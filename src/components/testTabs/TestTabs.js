import React, { useState } from 'react';
import './TestTabs.css'; // Import your CSS file
import { FormattedMessage } from 'react-intl';

const TestTabs = () => {
    const [tabs, setTabs] = useState([{ id: 1, label: 'Untitled' }]);
    const [nextTabId, setNextTabId] = useState(2);

    const addTab = () => {
        const newTabs = [...tabs, { id: nextTabId, label: `Untitled ${nextTabId}` }];
        setTabs(newTabs);
        setNextTabId(nextTabId + 1);
    };

    const removeTab = (e, tabId) => {
        e.preventDefault();
        const updatedTabs = tabs.filter(tab => tab.id !== tabId);
        setTabs(updatedTabs);
    };

    return (
        <>
            <h4><FormattedMessage id="testtabs.title" /></h4>

            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <button className="nav-link add-tab" onClick={addTab}>+</button>
                </li>
                {tabs.map(tab => (
                    <li className="nav-item" key={tab.id}>
                        <div className={`tab-label${tab.id === tabs.length ? ' active' : ''}`}>
                            <span>{tab.label}</span>
                            <button className="close-tab" onClick={(e) => removeTab(e, tab.id)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default TestTabs;
