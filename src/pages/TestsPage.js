import { useAppContext } from "../context/AppContext";

import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Form } from 'react-bootstrap';

const Tests = () => {
  const { tests, dispatchEvent } = useAppContext();
  const [showTextBox, setShowTextBox] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [savedFolders, setSavedFolders] = useState([]);

  const handleNodeSelect = (item) => {
    dispatchEvent("SELECT_TEST", item);
  };

  const handleAddFolderClick = () => {
    setShowTextBox(true);
  };


  const handleTextBoxClose = () => {
    setShowTextBox(false);
  };

  const handleSaveFolder = () => {
    if (folderName.trim() !== '') {
      setSavedFolders([...savedFolders, folderName]);
      setFolderName('');
    }
  };


  return (
    <div className="p-1">
      <div className="button-container">
        <Button className="color-black" variant="outline-light" onClick={handleAddFolderClick}>
          <i className="fa-solid fa-plus"></i>&nbsp;
          <FormattedMessage id="yourtests.addfolder" />
        </Button>
        <Button className="color-black" variant="outline-light">
          <i className="fa-solid fa-download"></i>&nbsp;
          <FormattedMessage id="yourtests.import" />
        </Button>
      </div>
      {showTextBox && (
        <div className="d-flex align-items-center p-1">
          <div className="flex-grow-1 mr-2">
            <Form.Control
              type="text"
              placeholder="Enter folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="rounded"
            />
          </div>
          <div className="d-flex">
            <Button onClick={handleSaveFolder} className="btn" style={{ color: 'black', backgroundColor: 'white' }}>
              <i className="fa-solid fa-check"></i>
            </Button>
            <Button onClick={handleTextBoxClose} className="btn ml-2" style={{ color: 'black', backgroundColor: 'white' }}>
              <i className="fa-solid fa-xmark"></i>
            </Button>
          </div>
        </div>
      )}


      <h3>Test List</h3>
      <div>
        <ul>
          {tests.map((item, index) => (
            <li key={index} onClick={() => handleNodeSelect(item)}>
              {item.title}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4>Saved Folders:</h4>
        <ul>
          {savedFolders.map((folder, index) => (
            <li key={index}>{folder}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Tests;