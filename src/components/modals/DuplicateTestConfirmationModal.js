import { Button, Modal } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { useAppContext } from '../../context/AppContext';

const DuplicateTestConfirmationModal = () => {
  const { showDuplicateTestConfimationModal, dispatchEvent } = useAppContext();

  const handleHideModal = () => {
    dispatchEvent('HIDE_DUPLICATE_TEST_MODAL');
  };

  const handleDuplicateTestInsert = () => {
    dispatchEvent('ADD_DUPLICATE_TEST');
  };

  return (
    <Modal show={showDuplicateTestConfimationModal} onHide={handleHideModal} backdrop="static" keyboard={false}>
      <Modal.Body>
        <FormattedMessage id="duplicateQuestionModal" />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleDuplicateTestInsert}>
          <FormattedMessage id="duplicateQuestionModalOk" />
        </Button>
        <Button variant="secondary" onClick={handleHideModal}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DuplicateTestConfirmationModal;
