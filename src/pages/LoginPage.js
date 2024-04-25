import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Spinner from 'react-bootstrap/Spinner';

// Login and session logic goes here.
const LoginPage = () => {
  return (
    <div className="authentication-message">
      <div className="loading" aria-label="loading screen">
        <Spinner className="spinner" animation="border" role="status" tabIndex="0">
          <span className="visually-hidden">
            <FormattedMessage id="loading" defaultMessage="Loading..." />
          </span>
        </Spinner>
      </div>
    </div>
  );
};

export default LoginPage;
