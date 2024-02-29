
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Form } from 'react-bootstrap';
import Toastify from '../common/Toastify';
import TreeView from "../../pages/tree-view-test-folders/TreeView";
import { saveTestFolder } from '../../services/testfolder.service';
import './Modalpopuplist.css';


const Modalpopuplist = ({ doReload, rootFolders, setDoReload }) => {
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

  const handleSaveFolder = async () => {
    if (folderName.trim() !== '') {
    
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
          setDoReload(!doReload);
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
    
  };

  const handleFolderSelect = (folderTitle) => {
    setFolderName(folderTitle);
    setEditFolderName(folderTitle);
    setShowTextBox(true);
    setIsEditing(true);
  };


  return (
    <>
      <div className="button-container">
        <Button className="color-black" variant="outline-light" onClick={handleAddFolderClick}>
          <i className="fa-solid fa-plus"></i>&ensp;
          <FormattedMessage id="yourtests.addfolder" />
        </Button>
        <Button className="color-black" variant="outline-light">
          
          <FormattedMessage id="yourtests.import" />
        </Button>
      </div>
      {showTextBox && (
        <div  className="show-text-box">
          <div >
            <Form.Control
              type="text"
              placeholder="Enter folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              
            />
          </div>
          <div>
            <Button 
              onClick={handleSaveFolder}
            
              aria-label='tick mark'
              >
              <i className="fa-solid fa-check"></i>
            </Button>
            <Button 
              onClick={handleTextBoxClose}
        
              aria-label='close mark'
              >
              <i className="fa-solid fa-xmark"></i>
            </Button>
          </div>
        </div>
      )}
      <div className="root-folders-tests">
        {rootFolders && rootFolders.length > 0 &&
         <TreeView 
         folderName={null} 
         testFolders={rootFolders} 
         onNodeUpdate={null} 
         handleFolderSelect={handleFolderSelect} />
         }
      </div>
    </>
  );
};

export default Modalpopuplist;

