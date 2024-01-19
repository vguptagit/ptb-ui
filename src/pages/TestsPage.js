import { useAppContext } from "../context/AppContext";
import TestFolder from "../components/AddTestFolder";
import React from 'react';
import { FormattedMessage } from "react-intl";

const Tests = () => {
  const { tests, dispatchEvent } = useAppContext();
  
  const handleNodeSelect = (item) => {
    dispatchEvent("SELECT_TEST", item);
  };

 
  return (
    <div className="p-1">
      
      <TestFolder/>
      
      <h2 className="test-list p-1">
        <FormattedMessage id="testlist.title" />
      </h2>
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