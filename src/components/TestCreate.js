import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useDrop } from "react-dnd";
import { FormattedMessage } from "react-intl";
import { Form } from "react-bootstrap";
import "./TestCreate.css";
import QuestionBanksTips from "./testTabs/QuestionsBanksTips/QuestionsBanksTips";
import Essay from "./questions/Essay";

const TestCreate = () => {
  const { selectedTest } = useAppContext();
  const [droppedNode, setDroppedNode] = useState(null);

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
          <Essay />
        ) : (
          <QuestionBanksTips />
        )}
      </div>
    </div>
  );
};

export default TestCreate;
