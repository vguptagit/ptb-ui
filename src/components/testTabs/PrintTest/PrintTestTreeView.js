import React, { useState, useEffect }  from 'react'
import { Tree } from "@minoru/react-dnd-treeview";
import './PrintTestTreeView.css';

const PrintTestTreeView = React.forwardRef(
  ({ savedQuestions, addStudentName, isChecked, setIsChecked }, ref) => {
    return (
      <div className={`p-3`} ref={ref} id="element">
        {addStudentName && (
          <div className="">
            <span>Student Name :</span>
          </div>
        )}
        {savedQuestions.map((item, index) => {
          return (
            <div key={index} className={`saved-content fs-6 ${isChecked === "leftSide" ? 'left-side-margin' : ''}`}>
              <div className="d-flex">
                <span className="question-number mt-4">{index + 1})</span>
                <div style={{ width: "100%" }}>
                  <div
                    className="printViewContainer mt-4"
                    dangerouslySetInnerHTML={{ __html: item.textHTML }}
                    id="print-popup-container"
                  />
                </div>
              </div>
              {Array.from({ length: item.spaceLine }, (_, spaceIndex) => (
                <div key={spaceIndex} className="w-100 p-3 mx-2"></div>
              ))}
            </div>
          );
        })}
      </div>
    );
  }
);

export default PrintTestTreeView;