import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalFooter } from 'react-bootstrap';
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
     const handleSave = () => {
        setShowModal(false)
     }
     useEffect(() => {
      
        if (showModal) {
            setStep(1);
        }
    }, [showModal]);


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
                    < ModalFooter>
                    <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        </>
    );
};


export default QuestBanks;
