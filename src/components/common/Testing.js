import { Button } from "react-bootstrap";
import { useState } from "react"
import Toastify from "./Toastify";
import Confirmation from './Confirmation'
import Loader from "../common/loader/Loader";

function Testing() {
    //This if for Confirmation popup
    const [confirmShow, setConfirmShow] = useState(false);
    const handleConfirmation = () => setConfirmShow(true);
    const [loader, setLoader] = useState(false);
    const handleLoader = () => setLoader(!loader);

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
                             variant="primary"
                            onClick={handleConfirmation}>Confirmation</Button>
                        {confirmShow && <Confirmation show={confirmShow} handleYes={handleConfirmYes} handleCancel={handleConfirmCancel} ></Confirmation>}
                    </div>
                    <div class="col-sm" style={{ padding: "10px" }}>
                        <Button onClick={handleLoader} variant="primary">Show Loader</Button>
                        {loader && <Loader show={loader}/>}
                    </div>
                </div>
            </div>
        </>
    );
}
export default Testing;