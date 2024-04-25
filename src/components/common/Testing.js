import { Button } from 'react-bootstrap';
import { useState } from 'react';
import Toastify from './Toastify';
import Confirmation from './Confirmation';
import Loader from '../common/loader/Loader';
import { FormattedMessage } from 'react-intl';

function Testing() {
  //This if for Confirmation popup
  const [confirmShow, setConfirmShow] = useState(false);
  const handleConfirmation = () => setConfirmShow(true);
  const [loader, setLoader] = useState(false);
  const handleLoader = () => setLoader(!loader);

  const handleConfirmYes = () => {
    setConfirmShow(false);
  };

  const handleConfirmCancel = () => {
    setConfirmShow(false);
  };
  //End Confirmation popup

  //this if for toast
  const notify = (type, message) => () => Toastify({ message: message, type: type });

  return (
    <>
      <div className="container">
        <div className="row">
          <div class="col-sm">
            <Button variant="info" className="button-setting" onClick={() => notify('info', 'info message')}>
              <FormattedMessage id="infoButton" defaultMessage="Info" />
            </Button>
          </div>
          <div class="col-sm">
            <Button variant="success" className="button-setting" onClick={() => notify('success', 'success message')}>
              <FormattedMessage id="successButton" defaultMessage="Success" />
            </Button>
          </div>
          <div class="col-sm">
            <Button variant="warning" className="button-setting" onClick={() => notify('warn', 'warn message')}>
              <FormattedMessage id="warningButton" defaultMessage="Warning" />
            </Button>
          </div>
          <div class="col-sm">
            <Button variant="danger" className="button-setting" onClick={() => notify('error', 'error message')}>
              <FormattedMessage id="errorButton" defaultMessage="Error" />
            </Button>
          </div>
        </div>
        <div className="row">
          <div class="col-sm" style={{ padding: '10px' }}>
            <Button variant="primary" onClick={handleConfirmation}>
              <FormattedMessage id="confirmationTesting" />
            </Button>
            {confirmShow && (
              <Confirmation
                show={confirmShow}
                handleYes={handleConfirmYes}
                handleCancel={handleConfirmCancel}
              ></Confirmation>
            )}
          </div>
          <div class="col-sm" style={{ padding: '10px' }}>
            <Button onClick={handleLoader} variant="primary">
              <FormattedMessage id="showLoaderTesting" />
            </Button>
            {loader && <Loader show={loader} />}
          </div>
        </div>
      </div>
    </>
  );
}
export default Testing;
