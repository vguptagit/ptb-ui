import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';

// Login and session logic goes here.
const LoginPage = () => {
  return (
    <div className="authentication-message">
      <Card>
        <Card.Body className="login-card-container">
          <Card.Text>
            <FormattedMessage id="authenticating-user" />
          </Card.Text>
          <Card.Text className="text">
            <div className="loading" aria-label="loading screen">
              <Spinner className="spinner" animation="border" role="status" tabIndex="0">
                <span className="visually-hidden">
                  <FormattedMessage id="loading" defaultMessage="Loading..." />
                </span>
              </Spinner>
            </div>
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LoginPage;
