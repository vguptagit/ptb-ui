import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './WelcomeScreen.css';
import Header from '../layouts/Header';
import { FormattedMessage } from 'react-intl';


const WelcomeScreen = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/discipline");
  };

  useEffect(() => {
    document.title = "Welcome Screen";
  }, []);

  return (
    <>
      <header className="App-header">
        <Header />
      </header>

      <div className="center-container">
        <Card className="card-container">
          <Card.Body>
            <Card.Title className="big-title">
              <FormattedMessage id="cardTitle" />
            </Card.Title>
            <Card.Text className="small-text">
              <FormattedMessage id="cardDescription" />
            </Card.Text>
            <hr className="my-4" />
            <Card.Text className="center-text">
              <FormattedMessage id="stepSetupText" />
            </Card.Text>
            <div className="icon-container">
              <div>
                <span className="number">1</span>
                <Card.Text className="text">
                  <FormattedMessage id="step1Text" />
                </Card.Text>
              </div>
              <div>
                <span className="number">2</span>
                <Card.Text className="text">
                  <FormattedMessage id="step2Text" />
                </Card.Text>
              </div>
              <div>
                <span className="number">3</span>
                <Card.Text className="text">
                  <FormattedMessage id="step3Text" />
                </Card.Text>
              </div>
            </div>
            <Button
              variant="primary"
              className="custom-button"
              aria-label='start button to activate press enter'
              onClick={handleStart}>
              <FormattedMessage id="startButtonText" />
            </Button>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default WelcomeScreen;
