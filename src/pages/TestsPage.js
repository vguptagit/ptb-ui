import { useAppContext } from "../context/AppContext";
import TestFolder from "../components/AddTestFolder";
import React from 'react';

const Tests = () => {
  const { tests, dispatchEvent } = useAppContext();
  
  const handleNodeSelect = (item) => {
    dispatchEvent("SELECT_TEST", item);
  };

 
  return (
    <div className="p-1">
      
      <TestFolder/>
      
      <h3>Test List</h3>
      <div>
        <ul>
          {tests.map((item, index) => (
            <li key={index} onClick={() => handleNodeSelect(item)}>
              {item.title}
            </li>
          ))}
        </ul>
      </div>
      
    </div>
  );
};

export default Tests;