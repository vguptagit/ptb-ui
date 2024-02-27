import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FormattedMessage } from "react-intl";
import TestsPage from '../../pages/TestsPage';
import '../testTabs/Modalpopup.css';
import { getRootTestFolders } from '../../services/testfolder.service';
import Toastify from '../common/Toastify';

function Modalpopup({ show, handleCloseModal }) {
  const [editFolderName, setEditFolderName] = useState("");
  const [rootFolders, setRootFolders] = useState([]);
  const [doReload, setDoReload] = useState(false);


  useEffect(() => {
    getRootTestFolders()
      .then((rootFolders) => {
        setRootFolders(rootFolders);
      })
      .catch((error) => {
        console.error('Error getting root folders:', error);
        if (error?.message?.response?.request?.status === 409) {
          Toastify({ message: error.message.response.data.message, type: 'error' });
        } else {
          Toastify({ message: 'Failed to get root folders', type: 'error' });
        }
      })
  }, [doReload]);

  return (
    <Modal show={show} onHide={handleCloseModal} centered>
      <Modal.Header >
        <Modal.Title>
          
            <div className="title-container">
              <h6>Save As:</h6>
              <Form>
                <Form.Control
                  type="text"
                  name="title"
                  placeholder="Enter Test title"
                  value
                  onChange
                  required
                />
              </Form>
        
          </div>
          <div className="text-container"> 
            <h6><FormattedMessage id="ModelText"/></h6>
            <Button>New Folder</Button>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <TestsPage/>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
      
      </Modal.Footer>
    </Modal>
  );
}

export default Modalpopup;
