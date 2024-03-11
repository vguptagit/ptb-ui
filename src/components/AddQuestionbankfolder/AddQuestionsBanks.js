import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import AddDisciplinepopup from './AddDisciplinepopup';
import AddBookspopup from './AddBookspopup';

const QuestBanks = () => {
    const [showModal, setShowModal] = useState(false);
    const [step, setStep] = useState(1);

    const handleNext = () => {
        setStep(step + 1);
    };

    const handleClose = () => {
        setShowModal(false);
        setStep(1);
    };
    const handleBack = () => {
        setStep(step - 1);
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
                <Modal show={showModal} onHide={handleClose}
                    size="lg"
                    aria-labelledby="example-custom-modal-styling-title" centered >
                    <Modal.Header>
                    </Modal.Header>
                    <Modal.Body>
                        {step === 1 ? (
                            <AddDisciplinepopup handleNext={handleNext} />
                        ) : (
                            <AddBookspopup handleBack={handleBack} />
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant='primary' >
                            Save
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
};

export default QuestBanks;
