import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useDrop } from "react-dnd";
import { FormattedMessage } from "react-intl";
import { Collapse, Form } from "react-bootstrap";
import "./TestCreate.css";
import QuestionBanksTips from "./testTabs/QuestionsBanksTips/QuestionsBanksTips";
import { Link } from "react-router-dom";

const TestCreate = () => {
  const { selectedTest } = useAppContext();
  const [droppedNode, setDroppedNode] = useState(null);
  const [open, setOpen] = useState(false);

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: "TREE_NODE",
    drop: (item) => {
      console.log("Dropped node:", item.node);
      setDroppedNode(item.node);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  useEffect(() => {
    console.log("TestCreate useEffect", selectedTest);
  }, [selectedTest]);

  return (
    <div ref={drop} className={`test-container ${canDrop && isOver ? "drop-active" : ""}`}>
      <div>
        <div className="d-flex align-items-center p-1 addfolder-container">
          <div className="flex-grow-1 mr-21 d-flex align-items-center">
            <div className="ml-2">
              <FormattedMessage id="testName" />
            </div>
            <Form.Control
              type="text"
              name="title"
              placeholder="Enter Title"
              value={selectedTest.title}
              className="rounded"
            />
          </div>
        </div>

        {droppedNode ? (
          <Form className="editmode border rounded p-3 bg-light">
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label className="mb-1">Enter Essay Questions</Form.Label>
            <Form.Control type="text" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label className="mb-1">Recommended Answer</Form.Label>
            <Form.Control as="textarea" rows={3} />
          </Form.Group>
          <div
                onClick={() => setOpen(!open)}
                className="d-flex align-items-center mb-3"
                style={{ cursor: 'pointer' }}
              >
                {open ?<i class="bi bi-caret-up-fill"></i> : <i class="bi bi-caret-down-fill"></i>}
                <span className="ms-2">Format and add metadata</span>
          </div>
          <Collapse key={open ? 'open' : 'closed'} in={open}>
              <div id="example-collapse-text" className={`d-flex gap-2 ${open ? 'visible' : 'invisible'}`}>
                <label htmlFor="option1">Essay Space:</label>
                <input type="radio" id="option1" name="options" />
                <label htmlFor="option1">None</label>

                <input type="radio" id="option2" name="options" />
                <label htmlFor="option2">1/4 page</label>

                <input type="radio" id="option3" name="options" />
                <label htmlFor="option3">1/2 page</label>

                <input type="radio" id="option4" name="options" />
                <label htmlFor="option4">1 page</label>
              </div>
          </Collapse>

          <div className="mb-1 d-flex justify-content-end">
          <Link className="savelink">
            Save
          </Link>
          <Link className="deletelink">Delete</Link>
        </div>
        </Form>
        ) : (
          <QuestionBanksTips />
        )}
      </div>
    </div>
  );
};

export default TestCreate;
