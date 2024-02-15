
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Form } from 'react-bootstrap';
import { saveTestFolder } from '../services/testfolder.service';
import Toastify from './common/Toastify';
import TreeView from "../pages/tree-view-test-folders/TreeView";
import { updateTestFolder } from '../services/testfolder.service';

const TestFolder = ({ rootFolders, setDoReload }) => {
  const [showTextBox, setShowTextBox] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [editFolderName, setEditFolderName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [updateKey, setUpdateKey] = useState(0);

  const handleAddFolderClick = () => {
    setShowTextBox(true);
    setIsEditing(false);
    if (!isEditing) {
      setFolderName("");
    }
  };

  const handleTextBoxClose = () => {
    setShowTextBox(false);
  };

  // need to update this
  const handleSaveFolder = async () => {
    if (folderName.trim() !== '') {
      if (isEditing) {
        // If editing, update the folder
        const editedFolderIndex = rootFolders.findIndex(
          (folder) => folder.title === editFolderName
        );
        const editedFolder = rootFolders[editedFolderIndex];
        const updatedFolderData = {
          guid: editedFolder.guid,
          sequence: editedFolder.sequence,
          title: folderName,
          extUserId: window.piSession.userId(),
        };
        try {
          await updateTestFolder(
            updatedFolderData
          );
          setUpdateKey(updateKey + 1);
          Toastify({ message: "Folder updated successfully", type: "success" });
          setDoReload();
        } catch (error) {
          Toastify({ message: 'Failed to update folder', type: 'error' });
        }
      } else {
        const newFolderData = {
          parentId: 0,
          sequence: rootFolders.length + 1,
          title: folderName,
          extUserId: window.piSession.userId(),
        };

        try {
          await saveTestFolder(newFolderData);
          setFolderName('');
          setShowTextBox(false);
          Toastify({ message: 'Folder saved successfully', type: 'success' });
          setDoReload();
        } catch (error) {
          if (error?.message?.response?.request?.status === 409) {
            Toastify({ message: error.message.response.data.message, type: 'error' });
          } else {
            Toastify({ message: 'Failed to save folder', type: 'error' });
          }
        }
      }
      setFolderName("");
      setShowTextBox(false);
    }
  };

  const handleFolderSelect = (folderTitle) => {
    setFolderName(folderTitle);
    setEditFolderName(folderTitle);
    setShowTextBox(true);
    setIsEditing(true);
  };

  const onNodeUpdate = (changedNode) => {
    updateTestFolder(changedNode)
      .then(() => {
        Toastify({ message: 'Folder rearranged successfully', type: 'success' });
        setDoReload();
      })
      .catch((error) => {
        console.error('Error getting root folders:', error);
        Toastify({ message: 'Failed to rearrange Folder', type: 'error' });
      })
  }

  return (
    <>
      <div className="button-container">
        <Button className="color-black" variant="outline-light" onClick={handleAddFolderClick}>
          <i className="fa-solid fa-plus"></i>&ensp;
          <FormattedMessage id="yourtests.addfolder" />
        </Button>
        <Button className="color-black" variant="outline-light">
          <i className="fa-solid fa-download"></i>&ensp;
          <FormattedMessage id="yourtests.import" />
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
              className="rounded ml-1"
            />
          </div>
          <div className="d-flex">
            <Button 
              onClick={handleSaveFolder}
              className="btn"
              aria-label='tick mark'
              style={{ color: 'black', backgroundColor: 'white' }}>
              <i className="fa-solid fa-check"></i>
            </Button>
            <Button 
              onClick={handleTextBoxClose}
              className="closebtn m1-2"
              aria-label='close mark'
              style={{ color: 'black', backgroundColor: 'white' }}>
              <i className="fa-solid fa-xmark"></i>
            </Button>
          </div>
        </div>
      )}
      <div className="root-folders-tests">
        {rootFolders && rootFolders.length > 0 && <TreeView testFolders={rootFolders} onNodeUpdate={onNodeUpdate} handleFolderSelect={handleFolderSelect} />}
      </div>
    </>
  );
};

export default TestFolder;

