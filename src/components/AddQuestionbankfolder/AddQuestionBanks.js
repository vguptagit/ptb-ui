import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalFooter } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import AddDisciplinepopup from './AddDisciplinepopup';
import AddBookspopup from './AddBookspopup';
import { useAppContext } from '../../context/AppContext';

const AddQuestionBanks = ({ reloadDisciplines }) => {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);

  const {
    disciplinesData: { userBooks },
    dispatchEvent,
  } = useAppContext();

  /**
   * useEffectHook - A React useEffect hook that sets the step state variable to 1 when the showModal prop is true.
   *
   * @param {boolean} showModal - A boolean prop that indicates whether the modal is shown or not.
   */
  useEffect(() => {
    if (showModal) {
      setStep(1);
    }
  }, [showModal]);

  /**
   * This function increments the current step by 1.
   */
  const handleNext = () => {
    setStep(step + 1);
  };

  /**
   * This function closes the modal and resets the selected disciplines data.
   */
  const handleClose = () => {
    setShowModal(false);
    setStep(1);
    dispatchEvent('UPDATE_DISCIPLINES_DATA', { selectedDisciplines: [], selectedBooks: userBooks });
  };

  /**
   * This function decrements the current step by 1.
   */
  const handleBack = () => {
    setStep(step - 1);
  };

  /**
   * Handles the save action by hiding the modal and reloading the disciplines.
   */
  const handleSave = () => {
    setShowModal(false);
    reloadDisciplines();
  };

  return (
    <>
      <div className="button-container">
        <Button className="color-black" variant="outline-light" onClick={() => setShowModal(true)}>
          <i className="fa-solid fa-plus"></i>&ensp;
          {'Add Questions Banks'}
        </Button>
      </div>
      <div>
        <Modal
          show={showModal}
          onHide={handleClose}
          size="lg"
          dialogClassName="modal-dialog-centered"
          backdrop="static"
          keyboard={false}
        >
          <Modal.Body>
            <div className="modal-content-wrapper">
              {step === 1 ? (
                <AddDisciplinepopup handleNext={handleNext} />
              ) : (
                <AddBookspopup handleBack={handleBack} handleSave={handleSave} />
              )}
            </div>
          </Modal.Body>
          <ModalFooter>
            <Button variant="secondary" onClick={handleClose}>
              <FormattedMessage id="cancelButton" defaultMessage="Cancel" />
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
};

export default AddQuestionBanks;
