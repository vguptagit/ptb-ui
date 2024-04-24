import React, { useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, Form } from 'react-bootstrap';
import Toastify from '../common/Toastify';
import TreeView from '../../pages/tree-view-test-folders/TreeView';
import { saveTestFolder, updateTestFolder } from '../../services/testfolder.service';
import { getRootTests } from '../../services/testcreate.service';
import './Modalpopuplist.css';
import Modalpopuptreeview from './Modalpopuptreeview';

const Modalpopuplist = ({ doReload, rootFolders, setDoReload, selectedFolderId, fetchUserFolders }) => {
  const [showTextBox, setShowTextBox] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [editFolderName, setEditFolderName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [updateKey, setUpdateKey] = useState(0);
  const [savedFolders, setSavedFolders] = useState([]);
  const [rootFolderGuid, setRootFolderGuid] = useState('');
  const intl = useIntl();

  useEffect(() => {
    const savedFoldersFromStorage = JSON.parse(localStorage.getItem('savedFolders'));
    if (savedFoldersFromStorage) {
      setSavedFolders(savedFoldersFromStorage);
    }
  }, []);

  useEffect(() => {
    fetchRootFolders();
  }, []);

  const fetchRootFolders = async () => {
    const rootFolder = await getRootTests();
    setRootFolderGuid(rootFolder.guid);
    console.log(rootFolderGuid);
  };

  const handleAddFolderClick = () => {
    setShowTextBox(true);
    setIsEditing(false);
    if (!isEditing) {
      setFolderName('');
    }
  };

  const handleTextBoxClose = () => {
    setShowTextBox(false);
  };

  // need to update this
  const handleSaveFolder = async () => {
    if (folderName.trim() !== '') {
      try {
        const maxSequence = savedFolders.reduce((max, folder) => {
          return folder.sequence > max ? folder.sequence : max;
        }, 1);
        const newSequence = maxSequence + 1;

        if (isEditing) {
          // If editing, update the folder
          const editedFolderIndex = savedFolders.findIndex(folder => folder.title === editFolderName);
          const editedFolder = savedFolders[editedFolderIndex];
          const updatedFolderData = {
            guid: editedFolder.guid,
            parentId: editedFolder.parentId,
            sequence: editedFolder.sequence,
            title: folderName,
            //extUserId: sessionStorage.getItem("userId"),
          };
          const updateFolder = await updateTestFolder(updatedFolderData);
          const updatedFolders = [...savedFolders, updateFolder];
          setSavedFolders(updatedFolders);
          localStorage.setItem('savedFolders', JSON.stringify(updatedFolders));
          setUpdateKey(updateKey + 1);

          Toastify({
            message: intl.formatMessage({ id: 'warning.testNameEmpty' }),
            type: 'success'
          });
        }

        else {
          const newFolderData = {
            parentId: rootFolderGuid,
            sequence: newSequence,
            title: folderName,
            //extUserId: sessionStorage.getItem("userId"),
          };
          const savedFolder = await saveTestFolder(
            newFolderData
            // userId
          );
          const updatedFolders = [...savedFolders, savedFolder];
          setSavedFolders(updatedFolders);
          localStorage.setItem('savedFolders', JSON.stringify(updatedFolders));
          setUpdateKey(updateKey + 1);

          Toastify({ message: 'Folder saved successfully', type: 'success' });
        }

        setFolderName('');
        setShowTextBox(false);

        // Fetch the updated folders immediately after saving or updating
        fetchUserFolders();
      } catch (error) {
        console.error('Error saving folder:', error);
        if (error ?.message ?.response ?.request ?.status === 409) {
          Toastify({
            message: error.message.response.data.message,
            type: 'error',
          });
        } else {

          Toastify({ message: 'Failed to save folder', type: 'error' });
        }
      }
    }
  };

  const handleFolderSelect = (folderTitle, folderGuid) => {
    setFolderName(folderTitle);
    setEditFolderName(folderTitle);
    setShowTextBox(true);
    setIsEditing(true);
    //setSelectedFolderGuid(folderGuid);
  };

  const onNodeUpdate = async changedNode => {
    try {
      await updateTestFolder(changedNode);

      Toastify({

        message: 'Folder rearranged successfully', type: 'success'
      });
    }

    catch (error) {
      console.error('Error rearranging folder:', error);
      if (error ?.message ?.response ?.request ?.status === 409) {
        Toastify({
          message: error.message.response.data.message,
          type: 'error',
        });
      }

      else {
        Toastify({
          message: 'Failed to rearrange folder', type: 'error'
        });
      }
    }
  };

  return (
    <>
      <div className="button-container">
        <Button className="color-black" variant="outline-light" onClick={handleAddFolderClick}>
          <i className="fa-solid fa-plus"></i>&ensp;
          <FormattedMessage id="yourtests.addfolder" />
        </Button>
        {/* <Button className="color-black" variant="outline-light"></Button> */}
      </div>
      {showTextBox && (
        <div className="search-box">
          <Form.Control
            width="30px"
            type="text"
            placeholder="Enter folder name"
            value={folderName}
            onChange={e => setFolderName(e.target.value)}
          />

          <div className="button-box">
            <Button onClick={handleSaveFolder} aria-label="tick mark">
              <i className="fa-solid fa-check"></i>
            </Button>
            <Button onClick={handleTextBoxClose} aria-label="close mark">
              <i className="fa-solid fa-xmark"></i>
            </Button>
          </div>
        </div>
      )}
      <div className="root-folders-tests">
        {rootFolders && rootFolders.length > 0 && (
          <Modalpopuptreeview
            key={updateKey}
            folders={rootFolders}
            onFolderSelect={handleFolderSelect}
            onNodeUpdate={onNodeUpdate}
            rootFolderGuid={rootFolderGuid}
          // selectedFolderGuid={selectedFolderGuid}
          />
        )}
      </div>
    </>
  );
};

export default Modalpopuplist;
