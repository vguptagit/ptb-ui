import { Button } from "react-bootstrap";
import { useState } from "react"
import Toastify from "./Toastify";
import Confirmation from './Confirmation'

function Testing() {
    //This if for Confirmation popup
    const [confirmShow, setConfirmShow] = useState(false);
    const handleConfirmation = () => setConfirmShow(true);

    const handleConfirmYes = () => {
        setConfirmShow(false)
    }

    const handleConfirmCancel = () => {
        setConfirmShow(false)
    }
    //End Confirmation popup

    //this if for toast
    const notify = (type, message) => () => Toastify({ 'message': message, 'type': type });

    return (
        <>
            <div className="container">
                <div className="row">
                    <div class="col-sm">
                        <Button
                            variant="info"
                            className="button-setting" onClick={notify("Info","info message")}>Info</Button>
                    </div>
                    <div class="col-sm">
                        <Button
                            variant="success"
                            className="button-setting" onClick={notify("success","success message")}>Success</Button>
                    </div>
                    <div class="col-sm">
                        <Button
                            variant="warning"
                            className="button-setting" onClick={notify("warn","warn message")}>Warning</Button>
                    </div>
                    <div class="col-sm">
                        <Button
                            variant="danger"
                            className="button-setting" onClick={notify("error","error message")}>Error</Button>
                    </div>
                </div>
                <div className="row">
                    <div class="col-sm" style={{ padding: "10px" }}>
                        <Button
                            variant="info"
                            onClick={handleConfirmation}>Confirmation</Button>
                        {confirmShow && <Confirmation show={confirmShow} handleYes={handleConfirmYes} handleCancel={handleConfirmCancel} ></Confirmation>}
                    </div>
                </div>
            </div>
        </>
    );
}
export default Testing;