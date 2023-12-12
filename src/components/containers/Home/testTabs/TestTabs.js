import React, { useState, useEffect } from 'react';
import './TestTabs.css'; // Import your CSS file

const TestTabs = () => {
    const [tabs, setTabs] = useState([{ id: 1, label: 'Untitled' }]);
    const [nextTabId, setNextTabId] = useState(2);

    useEffect(() => {
        // Add the FontAwesome link dynamically
        const link = document.createElement('link');
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
        link.rel = 'stylesheet';
        link.integrity = 'sha384-....'; // Replace with the actual integrity value
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);

        return () => {
            // Cleanup: remove the added link when the component is unmounted
            document.head.removeChild(link);
        };
    }, []);

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
            <h4>Create or Edit tests</h4>

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
