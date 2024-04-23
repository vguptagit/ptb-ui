import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Form } from 'react-bootstrap';
import { saveTestFolder } from '../services/testfolder.service';
import Toastify from './common/Toastify';
import TreeView from '../pages/tree-view-test-folders/TreeView';
import { updateTestFolder, updateTest } from '../services/testfolder.service';
import { useAppContext } from '../context/AppContext';
import { getUserBooks, getUserBooksByID } from '../services/book.service';
import { getPublisherTestsByBookId } from '../services/testcreate.service';

const TestFolder = ({ userId }) => {
  const {
    savedFolders,
    setSavedFolders,
    rootFolderGuid,
    fetchUserFolders,
    setSelectedViewTest,
    selectedViewTest,
    handleViewTest,
    setIsMigratedTests,
  } = useAppContext();
  const [showTextBox, setShowTextBox] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [editFolderName, setEditFolderName] = useState('');
  const [initialFetchDone, setInitialFetchDone] = useState(false);
  const [updateKey, setUpdateKey] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFolderGuid, setSelectedFolderGuid] = useState(null); // State to track the selected folder's GUID
  const [bookOpenStates, setBookOpenStates] = useState({});
  const [bookTests, setBookTests] = useState({});
  const [selectedBookIds, setSelectedBookIds] = useState([]);
  const [bookTitles, setBookTitles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState();
  // async function fetchRootFolderGuid(){
  //   try{
  //     const rootFolder = await getRootTests();
  //     setRootFolderGuid(rootFolder.guid);
  //     console.log(rootFolderGuid);
  //   } catch (error) {
  //     console.error("Error fetching root folder:", error);
  //   }
  // }

  useEffect(() => {
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

  useEffect(() => {
    if (isOpen) {
      fetchUserBooks();
    }
  }, [isOpen]);

  const fetchUserBooks = async () => {
    try {
      const bookIds = await getUserBooks();
      setSelectedBookIds(bookIds);
      const bookDetails = await Promise.all(
        bookIds.map(async bookId => {
          const book = await getUserBooksByID(bookId);
          return book;
        })
      );
      setBookTitles(bookDetails);
    } catch (error) {
      console.error('Error fetching user books:', error);
    }
  };

  const handleAddFolderClick = () => {
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
    setUpdateKey(updateKey + 1);
    const newHeight = `calc(81vh - 85px)`;
    setHeight(newHeight);
  };

  const handleSaveFolder = async () => {
    const folderNameLower = folderName.trim().toLowerCase();
    const migratedTestsLower = 'migrated tests'.toLowerCase();
    if (folderName.trim() !== '') {
      try {
        if (folderNameLower === migratedTestsLower) {
          Toastify({
            message: "Folder name 'Migrated Tests' cannot be used.",
            type: 'error',
          });
          return;
        }
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
            title: folderName.trim(),
            //extUserId: sessionStorage.getItem("userId"),
          };
          const updateFolder = await updateTestFolder(updatedFolderData);
          const updatedFolders = [...savedFolders, updateFolder];
          setSavedFolders(updatedFolders);
          localStorage.setItem('savedFolders', JSON.stringify(updatedFolders));
          setUpdateKey(updateKey + 1);
          Toastify({ message: 'Folder updated successfully', type: 'success' });
          const newHeight = `calc(81vh - 85px)`;
          setHeight(newHeight);
        } else {
          const newFolderData = {
            parentId: rootFolderGuid,
            sequence: newSequence,
            title: folderName.trim(),
            //extUserId: sessionStorage.getItem("userId"),
          };
          const savedFolder = await saveTestFolder(newFolderData, userId);
          const updatedFolders = [...savedFolders, savedFolder];
          setSavedFolders(updatedFolders);
          localStorage.setItem('savedFolders', JSON.stringify(updatedFolders));
          setUpdateKey(updateKey + 1);
          Toastify({ message: 'Folder saved successfully', type: 'success' });
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
    setSelectedFolderGuid(folderGuid);
  };

  const onNodeUpdate = async changedNode => {
    try {
      await updateTestFolder(changedNode);
      Toastify({ message: 'Folder rearranged successfully', type: 'success' });
    } catch (error) {
      console.error('Error rearranging folder:', error);
      if (error?.message?.response?.request?.status === 409) {
        Toastify({
          message: error.message.response.data.message,
          type: 'error',
        });
        fetchUserFolders();
      } else {
        Toastify({ message: 'Failed to rearrange folder', type: 'error' });
      }
    }
  };

  const onNodeUpdateTest = async (sourceId, destinationId, testId) => {
    try {
      await updateTest((sourceId = sourceId === 0 ? rootFolderGuid : sourceId), destinationId, testId);
      Toastify({ message: 'Test rearranged successfully', type: 'success' });
    } catch (error) {
      console.error('Error rearranging test:', error);
      if (error?.message?.response?.request?.status === 409) {
        Toastify({
          message: error.message.response.data.message,
          type: 'error',
        });
        fetchUserFolders();
      } else {
        Toastify({ message: 'Failed to rearrange test', type: 'error' });
      }
    }
  };

  const handleMigratedTestView = node => {
    console.log('Viewing migrated tests for node:', node);
    node.ismigrated = true;
    handleViewTest(node);
    setSelectedViewTest(node.guid);
    setIsMigratedTests(node.ismigrated);
  };

  const handleGetPublisherTests = async bookId => {
    try {
      if (!selectedBookIds || selectedBookIds.length === 0) {
        console.error('No book IDs selected.');
        return;
      }

      const tests = await getPublisherTestsByBookId(bookId);
      setBookTests(prevTests => ({
        ...prevTests,
        [bookId]: tests,
      }));
    } catch (error) {
      console.error(`Error fetching tests for book ID ${bookId}:`, error);
    }
  };

  const handleBookClick = bookId => {
    if (!bookOpenStates[bookId]) {
      handleGetPublisherTests(bookId);
    }
    toggleBookOpenState(bookId);
  };

  const toggleBookOpenState = bookId => {
    setBookOpenStates(prevState => ({
      ...prevState,
      [bookId]: !prevState[bookId],
    }));
  };

  return (
    <div className="p-2">
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
              onChange={e => setFolderName(e.target.value)}
              className="rounded ml-1"
            />
          </div>
          <div className="d-flex">
            <Button
              onClick={handleSaveFolder}
              className="btn"
              aria-label="tick mark"
              style={{ color: 'black', backgroundColor: 'white' }}
            >
              <i className="fa-solid fa-check"></i>
            </Button>
            <Button
              onClick={handleTextBoxClose}
              className="closebtn m1-2"
              aria-label="close mark"
              style={{ color: 'black', backgroundColor: 'white' }}
            >
              <i className="fa-solid fa-xmark"></i>
            </Button>
          </div>
        </div>
      )}
      <div className="your-test-list" style={{ height }}>
        <div className="maigratedtests">
          <div className="testbtn">
            {isOpen ? (
              <i className="fa fa-caret-down" onClick={() => setIsOpen(!isOpen)}></i>
            ) : (
              <i className="fa fa-caret-right" onClick={() => setIsOpen(!isOpen)}></i>
            )}
            <span style={{ marginLeft: '9px' }}>
              <FormattedMessage id="migratedtests" />
            </span>
          </div>
          {isOpen && bookTitles.length > 0 && (
            <div className="book-dropdown">
              {bookTitles.map((book, index) => (
                <div
                  key={book.guid}
                  style={{
                    borderBottom: index !== bookTitles.length - 1 ? '2px solid white' : 'none',
                    paddingBottom: '5px',
                  }}
                >
                  <button className="testbtn">
                    {bookOpenStates[book.guid] ? (
                      <i className="fa fa-caret-down" onClick={() => handleBookClick(book.guid)}></i>
                    ) : (
                      <i className="fa fa-caret-right" onClick={() => handleBookClick(book.guid)}></i>
                    )}

                    <span style={{ marginLeft: '9px' }}>{book.title}</span>
                  </button>
                  {bookOpenStates[book.guid] && bookTests[book.guid] && bookTests[book.guid].length > 0 && (
                    <div className="test-dropdown">
                      {bookTests[book.guid].map((test, index) => (
                        <div
                          key={index}
                          className="test-item"
                          style={{
                            borderBottom: index !== bookTests[book.guid].length - 1 ? '2px solid white' : 'none',
                          }}
                        >
                          {test.title}
                          <button
                            className={`info ${selectedViewTest === test.guid ? 'selected' : ''}`}
                            onClick={() => handleMigratedTestView(test)}
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="root-folders-and-tests" id="folders-tests">
          {savedFolders && savedFolders.length > 0 && (
            <TreeView
              key={updateKey}
              folders={savedFolders}
              onFolderSelect={handleFolderSelect}
              onNodeUpdate={onNodeUpdate}
              onNodeUpdateTest={onNodeUpdateTest}
              rootFolderGuid={rootFolderGuid}
              selectedFolderGuid={selectedFolderGuid}
              setHeight={setHeight}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TestFolder;
