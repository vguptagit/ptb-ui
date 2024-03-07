import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import "./testTabs/AddQuestionsBanks.css";
import Discipline from '../pages/Discipline/Discipline';

const QuestBanks = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    document.title = "Question Banks";
  }, []);



  return (
    <>
      <div className="button-container">
        <Button className="color-black" variant="outline-light" onClick={() => setShowModal(true)}>
          <i className="fa-solid fa-plus"></i>&ensp;

          {'Add Questions Banks'}
        </Button>
      </div>
      <div>
        <Modal show={showModal} onHide={() => setShowModal(false)}
      
          size="lg"
          aria-labelledby="example-custom-modal-styling-title" centered >
          <Modal.Header >
            <Modal.Title>
              Discipline
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <Discipline/>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button variant='primary'> Save </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default QuestBanks;
