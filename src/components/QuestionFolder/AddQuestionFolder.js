import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Form } from "react-bootstrap";
import { getUserQuestionFoldersRoot, saveUserQuestionFolder, getUserQuestionFolders } from "../../services/userfolder.service";
import Toastify from "../common/Toastify";
import "./AddQuestionFolder.css"
import TreeViewQuestionFolder from "./Treeview/TreeViewQuestionFolder";

const QuestionFolder = ({ userId }) => {
  const [showTextBox, setShowTextBox] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [savedFolders, setSavedFolders] = useState([]);
  const [rootFolderGuid, setRootFolderGuid] = useState("");
  const [initialFetchDone, setInitialFetchDone] = useState(false);
  const [updateKey, setUpdateKey] = useState(0);

  useEffect(() => {
    async function fetchRootFolderGuid() {
      try {
        const rootFolder = await getUserQuestionFoldersRoot();
        setRootFolderGuid(rootFolder.guid);
      } catch (error) {
        console.error("Error fetching root folder:", error);
      }
    }
    fetchRootFolderGuid();

    const savedFoldersFromStorage = JSON.parse(localStorage.getItem("savedFolders"));
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
      localStorage.setItem("savedFolders", JSON.stringify(folders));
    } catch (error) {
      console.error("Error fetching user folders:", error);
    }
  };

  const handleAddQuestionFolderClick = () => {
    setShowTextBox(true);
  };

  const handleTextBoxClose = () => {
    setShowTextBox(false);
  };

  const handleSaveFolder = async () => {
    if (folderName.trim() !== "") {
      try {
        const maxSequence = savedFolders.reduce((max, folder) => {
          return folder.sequence > max ? folder.sequence : max;
        }, 1);
        const newSequence = maxSequence + 1;

        const newFolderData = {
          parentId: rootFolderGuid,
          sequence: newSequence,
          title: folderName,
        };

        const savedFolder = await saveUserQuestionFolder(newFolderData, userId);

        const updatedFolders = [...savedFolders, savedFolder];
        setSavedFolders(updatedFolders);

        try {
          localStorage.setItem("savedFolders", JSON.stringify(updatedFolders));
        } catch (localStorageError) {
          console.error("Error setting data in local storage:", localStorageError);
        }

        setUpdateKey(updateKey + 1);
        setFolderName("");
        setShowTextBox(false);
        Toastify({ message: "Folder saved successfully", type: "success" });
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

  return (
    <div className="p-2">
      <div className="button-container">
        <Button
          className="color-black"
          variant="outline-light"
          onClick={handleAddQuestionFolderClick}
        >
          <i className="fa-solid fa-plus"></i>&nbsp;
          <FormattedMessage id="yourquestions.addquestionfolder" />
        </Button>
      </div>
      {showTextBox && (
        <div className="text-box d-flex align-items-center p-2">
          <div className="flex-grow-1 mr-4">
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
                color: "black",
                backgroundColor: "white",
              }}
            >
              <i className="fa-solid fa-check"></i>
            </Button>
            <Button
              onClick={handleTextBoxClose}
              className="closebtn"
              style={{ color: "black", backgroundColor: "white" }}
            >
              <i className="fa-solid fa-xmark"></i>
            </Button>
          </div>
        </div>
      )}
      {/* Render saved folders */}
      <div className="saved-folders">
        {savedFolders && savedFolders.length > 0 && <TreeViewQuestionFolder key={updateKey} folders={savedFolders}/> }
      </div>
    </div>
  );
};

export default QuestionFolder;
