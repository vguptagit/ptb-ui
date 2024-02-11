
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Form } from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { saveTestFolder } from '../services/testfolder.service';
import Toastify from './common/Toastify';

const TestFolder = ({rootFoldersLength, setDoReload}) => {
  const [showTextBox, setShowTextBox] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [savedFolders, setSavedFolders] = useState([]);

  const handleAddFolderClick = () => {
    setShowTextBox(true);
  };


  const handleTextBoxClose = () => {
    setShowTextBox(false);
  };

  const handleSaveFolder = async () => {
    if (folderName.trim() !== '') {
      const newFolderData = {
        parentId: 0,
        sequence: rootFoldersLength + 1,
        title: folderName
      };

      try {
        const savedFolder = await saveTestFolder(newFolderData);
        setSavedFolders([...savedFolders, savedFolder.title]);
        setFolderName('');
        setShowTextBox(false);
        Toastify({ message: 'Folder saved successfully', type: 'success' });
        console.log('Saved Folder:', savedFolder);
        setDoReload();
      } catch (error) {
        console.error('Error saving folder:', error);
        if (error?.message?.response?.request?.status === 409) {
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
        <OverlayTrigger placement="bottom" overlay={<Tooltip id="add-folder">Add new folder</Tooltip>}>
          <Button className="color-black" variant="outline-light" onClick={handleAddFolderClick}>
            <i className="fa-solid fa-plus"></i>&ensp;
            <FormattedMessage id="yourtests.addfolder" />
          </Button>
        </OverlayTrigger>
        <OverlayTrigger placement="bottom" overlay={<Tooltip id="import">Import</Tooltip>}>
          <Button className="color-black" variant="outline-light">
            <i className="fa-solid fa-download"></i>&ensp;
            <FormattedMessage id="yourtests.import" />
          </Button>
        </OverlayTrigger>
      </div>
      {showTextBox && (
        <div className="text-box d-flex align-items-center p-2">
          <div className="flex-grow-1 mr-2">
            <Form.Control
              type="text"
              placeholder="Enter folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="rounded ml-1"
            />
          </div>
          <div className="d-flex">
            <Button onClick={handleSaveFolder} className="btn" style={{ color: 'black', backgroundColor: 'white' }}>
              <i className="fa-solid fa-check"></i>
            </Button>
            <Button onClick={handleTextBoxClose} className="closebtn m1-2" style={{ color: 'black', backgroundColor: 'white' }}>
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

