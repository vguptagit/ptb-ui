import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Form } from 'react-bootstrap';
import { saveUserQuestionFolder } from '../services/userfolder.service';
import Toastify from './common/Toastify';

const QuestionFolder = ({ userId }) => {
  const [showTextBox, setShowTextBox] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [savedFolders, setSavedFolders] = useState([]);

  const handleAddQuestionFolderClick = () => {
    setShowTextBox(true);
  };

  const handleTextBoxClose = () => {
    setShowTextBox(false);
  };

  const handleSaveFolder = async () => {
    if (folderName.trim() !== '') {
      const newFolderData = {
        parentId: "",
        sequence: 1,
        title: folderName
      };
  
      try {
        const savedFolder = await saveUserQuestionFolder(newFolderData, userId);
        setSavedFolders([...savedFolders, savedFolder.title]);
        setFolderName('');
        setShowTextBox(false);
        Toastify({ message: 'Folder saved successfully', type: 'success' });
        console.log('Saved Folder:', savedFolder);
      } catch (error) {
        console.error('Error saving folder:', error);
        if (error.message.response.request.status === 409) {
          Toastify({ message: error.message.response.data.message, type: 'error' });
        } else {
          Toastify({ message: 'Failed to save folder', type: 'error' });
        }
      }
    }
  };
  

  return (
    <div className="p-2">
      <div className="button-container">
        <Button className="color-black" variant="outline-light" onClick={handleAddQuestionFolderClick}>
          <i className="fa-solid fa-plus"></i>&nbsp;
          <FormattedMessage id="yourquestions.addquestionfolder" />
        </Button>
      </div>
      {showTextBox && (
        <div className="text-box d-flex align-items-center p-2">
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
            <Button
              onClick={handleSaveFolder}
              className="btn"
              style={{
                color: 'black',
                backgroundColor: 'white',
              }}
            >
              <i className="fa-solid fa-check"></i>
            </Button>
            <Button onClick={handleTextBoxClose} className="btn ml-2" style={{ color: 'black', backgroundColor: 'white' }}>
              <i className="fa-solid fa-xmark"></i>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionFolder;
