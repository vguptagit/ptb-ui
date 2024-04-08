import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FormattedMessage } from "react-intl";
import { getRootTests } from '../../services/testcreate.service';
import { getUserTestFolders } from '../../services/testfolder.service';
import Toastify from '../common/Toastify';
import Modalpopuplist from './Modalpopuplist';

function Modalpopup({ show, handleCloseModal, handleSave, selectedTest }) {
  console.log("shiw",show);
  console.log("selcted title ",selectedTest?.title)
  const [editFolderName, setEditFolderName] = useState("");
  const [rootFolders, setRootFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [doReload, setDoReload] = useState(false);
  const [rootFolderGuid, setRootFolderGuid] = useState("");
  const [savedFolders, setSavedFolders] = useState([]);
  
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
        //const combinedData = [...rootFoldersResponse];
        setSavedFolders(rootFoldersResponse);
        setRootFolders(rootFoldersResponse)
        //localStorage.setItem("savedFolders", JSON.stringify(combinedData));
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

  console.log("selected fldrr id in modalpopup",selectedFolderId)
  useEffect(() => {
    if (selectedTest) {
      setEditFolderName(selectedTest.title || "");
    }
  }, [selectedTest]);
  const handleEditFolderNameChange = (e) => {
  
    setEditFolderName(e.target.value);
  };

  console.log("edited ",editFolderName)
  const handleSaveClick = (e) => {
    const storedSelectedFolderId = sessionStorage.getItem('selectedFolderId');
    if (storedSelectedFolderId) {
      setSelectedFolderId(JSON.parse(storedSelectedFolderId));
    }
    if (editFolderName.length > 0) {
       selectedTest.title = editFolderName;
    }
    handleSave(e, selectedTest, storedSelectedFolderId);
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
                onChange={handleEditFolderNameChange} 
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
        <Button variant="secondary" onClick={handleCloseModal}>
            <FormattedMessage id="cancelButtonModalPopup" />
        </Button>
        <Button variant='primary' onClick={handleSaveClick}>
          <FormattedMessage id="saveButtonModalpopupText" />
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Modalpopup;
