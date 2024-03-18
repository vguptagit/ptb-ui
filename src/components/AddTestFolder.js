import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Form } from "react-bootstrap";
import { saveTestFolder } from "../services/testfolder.service";
import Toastify from "./common/Toastify";
import TreeView from "../pages/tree-view-test-folders/TreeView";
import { 
  updateTestFolder,
  getUserTestFolders
 } from "../services/testfolder.service";
 import { 
  getFolderTests,
  getRootTests
} from "../services/testcreate.service";

const TestFolder = ({ userId }) => {
  const [showTextBox, setShowTextBox] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [editFolderName, setEditFolderName] = useState("");
  const [savedFolders, setSavedFolders] = useState([]);
  const [rootFolderGuid, setRootFolderGuid] = useState("");
  const [initialFetchDone, setInitialFetchDone] = useState(false);
  const [updateKey, setUpdateKey] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFolderGuid, setSelectedFolderGuid] = useState(null); // State to track the selected folder's GUID
  
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
    const savedFoldersFromStorage = JSON.parse(
      localStorage.getItem("savedFolders")
    );
    if(savedFoldersFromStorage) {
      setSavedFolders(savedFoldersFromStorage);
    }

    setInitialFetchDone(true);
  }, []);
  
  useEffect(() => {
    if(initialFetchDone) {
      fetchUserFolders();
    }
  }, [initialFetchDone]);

  useEffect(() => {
    fetchUserFolders();
  }, []);
  
  const fetchUserFolders = async () => {
    const rootFolder = await getRootTests();
      setRootFolderGuid(rootFolder.guid);
      console.log(rootFolderGuid);
      
    Promise.all([getUserTestFolders(rootFolder.guid), getFolderTests(rootFolder.guid)])
      .then(([rootFoldersResponse, folderTestsResponse]) => {
        const combinedData = [...rootFoldersResponse, ...folderTestsResponse];
        setSavedFolders(combinedData);
        localStorage.setItem("savedFolders", JSON.stringify(combinedData));
      })
      .catch((error) => {
        console.error('Error getting root folders or folder tests:', error);
        if (error?.message?.response?.request?.status === 409) {
            Toastify({ message: error.message.response.data.message, type: 'error' });
        } else {
            Toastify({ message: 'Failed to get root folders or folder tests', type: 'error' });
        }
    });
  }

  const handleAddFolderClick = () => {
    setShowTextBox(true);
    setIsEditing(false);
    setFolderName("");
    if (!isEditing) {
      setFolderName("");
    }
  };

  const handleTextBoxClose = () => {
    setShowTextBox(false);
    setFolderName("");
    setUpdateKey(updateKey + 1);
  };

  // need to update this
  const handleSaveFolder = async () => {
    if (folderName.trim() !== "") {
      try {
        const maxSequence = savedFolders.reduce((max, folder) => {
          return folder.sequence > max ? folder.sequence : max;
        }, 1);
        const newSequence = maxSequence + 1;

      if (isEditing) {
        // If editing, update the folder
        const editedFolderIndex = savedFolders.findIndex(
          (folder) => folder.title === editFolderName
        );
        const editedFolder = savedFolders[editedFolderIndex];
        const updatedFolderData = {
          guid: editedFolder.guid,
          parentId: editedFolder.parentId,
          sequence: editedFolder.sequence,
          title: folderName.trim(),
          //extUserId: sessionStorage.getItem("userId"),
        };
        const updateFolder =  await updateTestFolder(
          updatedFolderData
          );
          const updatedFolders = [...savedFolders, updateFolder];
          setSavedFolders(updatedFolders);
          localStorage.setItem("savedFolders", JSON.stringify(updatedFolders));
          setUpdateKey(updateKey + 1);
          Toastify({ message: "Folder updated successfully", type: "success" });
      } else {
        const newFolderData = {
          parentId: rootFolderGuid,
          sequence: newSequence,
          title: folderName.trim(),
          //extUserId: sessionStorage.getItem("userId"),
        };
        const savedFolder = await saveTestFolder(
          newFolderData,
          userId
        );
        const updatedFolders = [...savedFolders, savedFolder];
        setSavedFolders(updatedFolders);
        localStorage.setItem("savedFolders", JSON.stringify(updatedFolders));
        setUpdateKey(updateKey + 1);
        Toastify({ message: "Folder saved successfully", type: "success" });
      }

      setFolderName("");
      setShowTextBox(false);

      // Fetch the updated folders immediately after saving or updating
      fetchUserFolders();
    } catch (error) {
      console.error("Error saving folder:", error);
      if (error?.message?.response?.request?.status === 409) {
        Toastify({
          message: error.message.response.data.message,
          type: "error",
        });
      } else {
        Toastify({ message: "Failed to save folder", type: "error" });
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

  const onNodeUpdate = async (changedNode) => {
    try{
    await updateTestFolder(changedNode);
    Toastify({ message: "Folder rearranged successfully", type: "success" });
  } catch (error) {
    console.error("Error rearranging folder:", error);
    if (error?.message?.response?.request?.status === 409) {
      Toastify({
        message: error.message.response.data.message,
        type: "error",
      });
      fetchUserFolders();
    } else {
      Toastify({ message: "Failed to rearrange folder", type: "error" });
    }
  }
};


  return (
    <div className="p-2">
      <div className="button-container">
        <Button
          className="color-black"
          variant="outline-light"
          onClick={handleAddFolderClick}
        >
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
              aria-label="tick mark"
              style={{ color: "black", backgroundColor: "white" }}
            >
              <i className="fa-solid fa-check"></i>
            </Button>
            <Button
              onClick={handleTextBoxClose}
              className="closebtn m1-2"
              aria-label="close mark"
              style={{ color: "black", backgroundColor: "white" }}
            >
              <i className="fa-solid fa-xmark"></i>
            </Button>
          </div>
        </div>
      )}
      <div className="root-folders-tests" id="folders-tests">
        {savedFolders && savedFolders.length > 0 && (
          <TreeView
            key={updateKey}
            folders={savedFolders}
            onFolderSelect={handleFolderSelect}
            onNodeUpdate={onNodeUpdate}
            rootFolderGuid={rootFolderGuid}
            selectedFolderGuid={selectedFolderGuid}
          />
        )}
      </div>
    </div>
  );
};

export default TestFolder;
