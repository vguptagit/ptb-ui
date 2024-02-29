import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const TrueFalse = ({ questionNode, onQuestionStateChange, onQuestionDelete }) => {
  const [isEditing, setIsEditing] = useState(questionNode.qtiModel.EditOption);
  const [question, setQuestion] = useState(questionNode.qtiModel.Caption || '');
  const [correctAnswer, setCorrectAnswer] = useState(questionNode.qtiModel.CorrectAnswer || 'True');

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleAnswerChange = (e) => {
    setCorrectAnswer(e.target.value);
  };

  const handleSave = () => {
    questionNode.qtiModel.Caption = question;
    questionNode.qtiModel.CorrectAnswer = correctAnswer;
    questionNode.qtiModel.EditOption = false;
    setIsEditing(false);
    onQuestionStateChange(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    onQuestionStateChange(true);
  };

  const handleDelete = () => {
    onQuestionDelete(questionNode.itemId);
  };

  return (
    <div id={questionNode.itemId}>
      {!isEditing ? (
        <div className="display-mode">
          <p>{questionNode.itemId}) {question}</p>
          <p>Answer: {correctAnswer}</p>
          <Button onClick={handleEdit}>Edit</Button>
          <Button onClick={handleDelete}>Delete</Button>
        </div>
      ) : (
        <Form>
          <Form.Group>
            <Form.Label>Enter True or False Question</Form.Label>
            <Form.Control
              type="text"
              value={question}
              onChange={handleQuestionChange}
            />
          </Form.Group>
          <div className="mb-3">
            <Form.Check
              inline
              label="True"
              type="radio"
              id="trueOption"
              name="trueFalseOptions"
              value="True"
              checked={correctAnswer === 'True'}
              onChange={handleAnswerChange}
            />
            <Form.Check
              inline
              label="False"
              type="radio"
              id="falseOption"
              name="trueFalseOptions"
              value="False"
              checked={correctAnswer === 'False'}
              onChange={handleAnswerChange}
            />
          </div>
          <div className="d-flex justify-content-end">
            <Button className="me-2" variant="primary" onClick={handleSave}>
              Save
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
};

export default TrueFalse;