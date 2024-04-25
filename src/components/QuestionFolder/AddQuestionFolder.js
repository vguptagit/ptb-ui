import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, Form } from 'react-bootstrap';
import {
  getUserQuestionFoldersRoot,
  saveUserQuestionFolder,
  getUserQuestionFolders,
  updateUserQuestionFolders,
  getUserQuestions,
} from '../../services/userfolder.service';
import Toastify from '../common/Toastify';
import './AddQuestionFolder.css';
import TreeViewQuestionFolder from './Treeview/TreeViewQuestionFolder';
import QtiService from '../../utils/qti-converter';
import { useAppContext } from '../../context/AppContext';

const QuestionFolder = ({ userId }) => {
  const [showTextBox, setShowTextBox] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [editFolderName, setEditFolderName] = useState('');
  const [savedFolders, setSavedFolders] = useState([]);
  const [rootFolderGuid, setRootFolderGuid] = useState('');
  const [initialFetchDone, setInitialFetchDone] = useState(false);
  const [updateKey, setUpdateKey] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFolderGuid, setSelectedFolderGuid] = useState(null);
  const [height, setHeight] = useState();
  const { setLoading } = useAppContext();
  const intl = useIntl();

  async function fetchRootFolderGuid() {
    try {
      const rootFolder = await getUserQuestionFoldersRoot();
      setRootFolderGuid(rootFolder.guid);
      setLoading(true);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching root folder:', error);
    }
  }

  useEffect(() => {
    fetchRootFolderGuid();
    const savedFoldersFromStorage = JSON.parse(localStorage.getItem('savedFolders'));
    if (savedFoldersFromStorage) {
      setSavedFolders(savedFoldersFromStorage);
    }

    setInitialFetchDone(true);
  }, []);

  useEffect(() => {
    if (initialFetchDone) {
      fetchUserFolders();
    }
  }, [initialFetchDone]);

  useEffect(() => {
    fetchUserFolders();
  }, []);
  const fetchUserFolders = async () => {
    try {
      const folders = await getUserQuestionFolders();
      setSavedFolders(folders);
      setLoading(true);
      localStorage.setItem('savedFolders', JSON.stringify(folders));
    } catch (error) {
      setLoading(false);
      console.error('Error fetching user folders:', error);
    }
  };

  const handleAddQuestionFolderClick = () => {
    setShowTextBox(true);
    setIsEditing(false);
    setFolderName('');
    if (!isEditing) {
      setFolderName('');
    }
    const newHeight = `calc(72vh - 85px)`;
    setHeight(newHeight);
  };

  const handleTextBoxClose = () => {
    setShowTextBox(false);
    setFolderName('');
    const newHeight = `calc(81vh - 85px)`;
    setHeight(newHeight);
  };

  const handleSaveFolder = async () => {
    const trimmedFolderName = folderName.trim();

    if (trimmedFolderName !== '') {
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
            title: trimmedFolderName,
          };
          const updateFolder = await updateUserQuestionFolders(updatedFolderData);
          const updatedFolders = [...savedFolders];
          updatedFolders[editedFolderIndex] = updateFolder;
          setSavedFolders(updatedFolders);
          localStorage.setItem('savedFolders', JSON.stringify(updatedFolders));
          setUpdateKey(updateKey + 1);

          Toastify({
            message: intl.formatMessage({ id: 'success.FolderUpdatedSuccessfully' }),
            type: 'success',
          });

          const newHeight = `calc(81vh - 85px)`;
          setHeight(newHeight);
        } else {
          // If not editing, save the new folder
          const newFolderData = {
            parentId: rootFolderGuid,
            sequence: newSequence,
            title: trimmedFolderName,
          };
          const savedFolder = await saveUserQuestionFolder(newFolderData, userId);
          const updatedFolders = [...savedFolders, savedFolder];
          setSavedFolders(updatedFolders);
          localStorage.setItem('savedFolders', JSON.stringify(updatedFolders));
          setUpdateKey(updateKey + 1);

          Toastify({
            message: intl.formatMessage({ id: 'success.FolderSavedSuccessfully' }),
            type: 'success',
          });

          const newHeight = `calc(81vh - 85px)`;
          setHeight(newHeight);
        }

        setFolderName('');
        setShowTextBox(false);

        // Fetch the updated folders immediately after saving or updating
        fetchUserFolders();
      } catch (error) {
        console.error('Error saving folder:', error);
        if (error?.message?.response?.request?.status === 409) {
          Toastify({
            message: error.message.response.data.message,
            type: 'error',
          });
        } else {
          Toastify({
            message: intl.formatMessage({ id: 'error.FailedToSaveFolder' }),
            type: 'error',
          });
        }
      }
    } else {
      Toastify({
        message: intl.formatMessage({ id: 'error.FolderNameCannotBeEmpty' }),
        type: 'error',
      });
    }
  };

  const handleFolderSelect = (folderTitle, folderGuid) => {
    setFolderName(folderTitle);
    setEditFolderName(folderTitle);
    setShowTextBox(true);
    setIsEditing(true);
    setSelectedFolderGuid(folderGuid);
  };

  const onNodeUpdate = async changedNode => {
    try {
      await updateUserQuestionFolders(changedNode);

      Toastify({
        message: intl.formatMessage({ id: 'success.FolderRearrangedSuccessfully' }),
        type: 'success',
      });
    } catch (error) {
      console.error('Error rearranging folder:', error);

      Toastify({
        message: intl.formatMessage({ id: 'error.FailedToRearrangeFolder' }),
        type: 'error',
      });
    }
  };

  return (
    <div className="p-2">
      <div className="button-container">
        <Button className="color-black" variant="outline-light" onClick={handleAddQuestionFolderClick}>
          <i className="fa-solid fa-plus mr-2"></i>&nbsp;
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
              onChange={e => setFolderName(e.target.value)}
              className="rounded ml-1"
            />
          </div>
          <div className="d-flex">
            <Button
              onClick={handleSaveFolder}
              className="btn"
              aria-label="tick mark"
              style={{
                color: 'black',
                backgroundColor: 'white',
              }}
            >
              <i className="fa-solid fa-check"></i>
            </Button>
            <Button
              onClick={handleTextBoxClose}
              className="closebtn ml-10"
              aria-label="close mark"
              style={{ color: 'black', backgroundColor: 'white' }}
            >
              <i className="fa-solid fa-xmark"></i>
            </Button>
          </div>
        </div>
      )}
      {/* Render saved folders */}
      <div className="saved-folders" style={{ height }}>
        <TreeViewQuestionFolder
          key={updateKey}
          folders={savedFolders}
          onFolderSelect={handleFolderSelect}
          onNodeUpdate={onNodeUpdate}
          rootFolderGuid={rootFolderGuid}
          selectedFolderGuid={selectedFolderGuid}
          setHeight={setHeight}
        />
      </div>
    </div>
  );
};

export default QuestionFolder;
