import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react'

function Confirmation(props) {
    const [show, setShow] = useState(false);

    const handleYes = () =>{
        setShow(false);
        props.handleYes();
    }

    const handleCancel = () =>{
        setShow(false);
        props.handleCancel();
    }

    useEffect(() => {
        setShow(props.show);
    }, []);


    return (
        <>
            <Modal show={show} onHide={handleCancel}  >
                <Modal.Header closeButton>
                    <Modal.Title>Heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>Confirmation Message!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancel} >
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleYes} >
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Confirmation;