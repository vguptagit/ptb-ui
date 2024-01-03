import { Button } from "react-bootstrap";
import Toastify from "../components/common/Toastify"


const Questions = () => {

    const notify = (type) => () => Toastify({ 'message': "information for the user", 'type': type });

    return (
        <>
            <div class="container row">
                <div class="col-sm">
                    <Button
                        variant="info"
                        className="button-setting" onClick={notify("Info")}>Info</Button>
                </div>
                <div class="col-sm">
                    <Button
                        variant="success"
                        className="button-setting" onClick={notify("success")}>Success</Button>
                </div>
                <div class="col-sm">
                    <Button
                        variant="warning"
                        className="button-setting" onClick={notify("warn")}>Warning</Button>
                </div>
                <div class="col-sm">
                    <Button
                        variant="danger"
                        className="button-setting" onClick={notify("error")}>Error</Button>
                </div>               
            </div>
        </>
    );
}
export default Questions;