
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Form } from 'react-bootstrap';


const QuestionFolder = () => {
    const [showTextBox, setShowTextBox] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [savedFolders, setSavedFolders] = useState([]);

  const handleAddQuestionFolderClick = () => {
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
        <Button className="color-black" variant="outline-light" onClick={handleAddQuestionFolderClick}>
          <i className="fa-solid fa-plus"></i>&nbsp;
          <FormattedMessage id="yourquestions.addquestionfolder" />
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

export default QuestionFolder;

