import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FormattedMessage } from "react-intl";
import { getRootTestFolders } from '../../services/testfolder.service';
import Toastify from '../common/Toastify';
import Modalpopuplist from './Modalpopuplist';

function Modalpopup({ show, handleCloseModal,handleSave,selectedTitle }) {
  const [editFolderName, setEditFolderName] = useState("");
  const [rootFolders, setRootFolders] = useState([]);
  const [doReload, setDoReload] = useState(false);
  console.log("show",show)
console.log("slectedtest",selectedTitle)
  console.log("clse",handleCloseModal)
  useEffect(() => {
    document.title = "Your Tests";
  }, []);

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
      });
  }, [doReload]);

  return (
    <Modal show={show} onHide={handleCloseModal} centered>
      <Modal.Header>
        <Modal.Title>
          <div style={{display: "flex"}}>
            <div>  <h6>Save As:</h6></div>
          
            <Form style={{marginInlineStart:"2px"}}>
              <Form.Control
                type="text"
                name="title"
                placeholder="Enter"
                value={selectedTitle}
                onChange={(e) => setEditFolderName(e.target.value)}
                required
              />
            </Form>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="p-2">
          <Modalpopuplist rootFolders={rootFolders} doReload={doReload} setDoReload={setDoReload} />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='primary' onClick={handleSave}> Save </Button>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Modalpopup;
