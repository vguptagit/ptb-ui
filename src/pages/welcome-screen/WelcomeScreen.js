import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './WelcomeScreen.css';

const WelcomeScreen = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/home");
  };

  return (
    <div className="center-container">
      <Card className="card-container">
        <Card.Body>
          <Card.Title className="big-title">Pearson Test Builder</Card.Title>
          <Card.Text className="small-text">
            The powerful new Pearson Test Builder will
            streamline all your test creation tasks.
          </Card.Text>
          <hr className="my-4" />
          <Card.Text className="center-text">Three steps setup</Card.Text>
        <div className="icon-container">
          <div>
            <span className="number">1</span>
            <Card.Text className="text">Choose Your Discipline</Card.Text>
          </div>

          <div>
            <span className="number">2</span>
            <Card.Text className="text">Choose Your Textbooks or Topics</Card.Text>
          </div>

          <div>
            <span className="number">3</span>
            <Card.Text className="text">Import Tests or Questions</Card.Text>
          </div>
        </div>

          <Button variant="primary" className="custom-button" onClick={handleStart}>Start</Button>
        </Card.Body>
      </Card>
    </div>
  );
}

export default WelcomeScreen;
