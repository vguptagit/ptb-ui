
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Form } from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const TestFolder = () => {
    const [showTextBox, setShowTextBox] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [savedFolders, setSavedFolders] = useState([]);

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
    <div className="p-2">
      <div className="button-container">
        <OverlayTrigger placement="bottom" overlay={<Tooltip id="add-folder">Add new folder</Tooltip>}>
          <Button className="color-black" variant="outline-light" onClick={handleAddFolderClick}>
            <i className="fa-solid fa-plus"></i>&ensp;
            <FormattedMessage id="yourtests.addfolder" />
          </Button>
        </OverlayTrigger>
          <Button className="color-black" variant="outline-light">
            <i className="fa-solid fa-download"></i>&ensp;
            <FormattedMessage id="yourtests.import" />
          </Button>
      </div>
      {showTextBox && (
        <div className="d-flex align-items-center mt-2">
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
<div>
        {/* <h2 className='saved-folders p-1'>Saved Folders:</h2>
        <ul>
          {savedFolders.map((folder, index) => (
            <li key={index}>{folder}</li>
          ))}
        </ul> */}
      </div>
    </div>
  );
};

export default TestFolder;

