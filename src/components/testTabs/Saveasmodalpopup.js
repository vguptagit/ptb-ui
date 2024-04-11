import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FormattedMessage } from "react-intl";
import { getRootTests } from '../../services/testcreate.service';
import { getUserTestFolders } from '../../services/testfolder.service';
import Toastify from '../common/Toastify';
import Modalpopuplist from './Modalpopuplist';
import { useAppContext } from '../../context/AppContext';
import Loader from '../common/loader/Loader';

function Modalpopup({ show, handleCloseModal, handleSave, selectedTest }) {
  const { dispatchEvent } = useAppContext();
  console.log("selcted title ", selectedTest?.title)
  const [editFolderName, setEditFolderName] = useState("");
  const [rootFolders, setRootFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [doReload, setDoReload] = useState(false);
  const [rootFolderGuid, setRootFolderGuid] = useState("");
  const [savedFolders, setSavedFolders] = useState([]);
  const [saving, setSaving] = useState(false); // State variable to track saving process

  useEffect(() => {
    document.title = "Your Tests";
  }, []);

  useEffect(() => {
    fetchUserFolders();
  }, []);

  const fetchUserFolders = async () => {
    const rootFolder = await getRootTests();
    setRootFolderGuid(rootFolder.guid);
    console.log(rootFolderGuid);

    Promise.all([getUserTestFolders(rootFolder.guid)])
      .then(([rootFoldersResponse]) => {
        setSavedFolders(rootFoldersResponse);
        setRootFolders(rootFoldersResponse)

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

  console.log("selected fldrr id in modalpopup", selectedFolderId)
  useEffect(() => {
    if (selectedTest) {
      setEditFolderName(selectedTest.title || "");
    }
  }, [selectedTest]);
  const handleTitleChange = (event) => {
    let newTitle = event.target.value;

   
    newTitle = newTitle.replace(/[^a-zA-Z0-9!@#$%^&*(),.?":{}|<>\s]/g, "");

    if (newTitle.length > 255) {
      newTitle = newTitle.slice(0, 255);
    }
    newTitle = newTitle.charAt(0).toUpperCase() + newTitle.slice(1);

    setEditFolderName(newTitle);


  
    if (selectedTest && selectedTest.id) {

      const updatedSelectedTest = { ...selectedTest };
     
      updatedSelectedTest.title = newTitle;
 
      dispatchEvent("UPDATE_TEST_TITLE", updatedSelectedTest);
    }
  };

  console.log("edited ", editFolderName)
  const handleSaveClick = async (e) => {
    if (saving) return;
    setSaving(true);
    var storedSelectedFolderId = sessionStorage.getItem('selectedFolderId');
    if (storedSelectedFolderId) {
      storedSelectedFolderId = JSON.parse(storedSelectedFolderId);
      setSelectedFolderId(storedSelectedFolderId);
    }
    if (editFolderName.length > 0) {
  
      const updatedTest = { ...selectedTest, title: editFolderName };
      try {
        await handleSave(e, updatedTest, storedSelectedFolderId, editFolderName);
        setSaving(false); 
      } catch (error) {
        console.error('Error saving:', error);
        Toastify({ message: 'Failed to save', type: 'error' });
        setSaving(false); 
      }
    } else {

      try {
        await handleSave(e, selectedTest, storedSelectedFolderId, editFolderName);
        setSaving(false); 
      } catch (error) {
        console.error('Error saving:', error);
        Toastify({ message: 'Failed to save', type: 'error' });
        setSaving(false); 
      }
    }
  };

  return (
    <Modal show={show} onHide={handleCloseModal} centered>
      <Modal.Header >
        <Modal.Title>
          <div style={{ display: "flex" }}>
            <div style={{ marginBlockStart: "5px" }}> <h6>Save As:</h6></div>
            <Form style={{ marginInlineStart: "6px" }}>
              <Form.Control
                type="text"
                name="title"
                placeholder="Enter"
                value={editFolderName}
                onChange={handleTitleChange}
                required
              />
            </Form>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <Modalpopuplist rootFolders={rootFolders}
            doReload={doReload} setDoReload={setDoReload}
            selectedFolderId={selectedFolderId}
            fetchUserFolders={fetchUserFolders}
          />
        </div>

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal} disabled={saving}>
          <FormattedMessage id="cancelButtonSaveasmodalpopupText" />
        </Button>
        <Button variant='primary' name="saveAs" onClick={handleSaveClick} disabled={saving}>
          {saving ? <Loader animation="border" size="sm" /> : <FormattedMessage id="saveButtonSaveasmodalpopupText" />}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Modalpopup;
