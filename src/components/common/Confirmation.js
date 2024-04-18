import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

function Confirmation(props) {
  const [show, setShow] = useState(false);

  const handleYes = () => {
    setShow(false);
    props.handleYes();
  };

  const handleCancel = () => {
    setShow(false);
    props.handleCancel();
  };

  useEffect(() => {
    setShow(props.show);
  }, []);

  return (
    <>
      <Modal show={show} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>
            <FormattedMessage id="modalHeading" defaultMessage="Heading" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormattedMessage id="confirmationMessage" defaultMessage="Confirmation Message!" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            <FormattedMessage id="closeButton1" defaultMessage="Close" />
          </Button>
          <Button variant="primary" onClick={handleYes}>
            <FormattedMessage id="saveChangesButton" defaultMessage="Save Changes" />
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Confirmation;
