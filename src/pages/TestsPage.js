import { useAppContext } from "../context/AppContext";
import TestFolder from "../components/AddTestFolder";
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from "react-intl";
import { getRootTestFolders } from '../services/testfolder.service';
import Toastify from '../components/common/Toastify';
import TreeView from "../pages/tree-view/TreeView";

const Tests = () => {
  const [rootFolders, setRootFolders] = useState([]);
  const { tests, dispatchEvent } = useAppContext();
  const [doReload, setDoReload] = useState(false);

  useEffect(() => {
    document.title = "Your Tests";
  }, []);
  
  const handleNodeSelect = (item) => {
    dispatchEvent("SELECT_TEST", item);
  };

  useEffect(()=>{
    getRootTestFolders()
    .then((rootFolders)=> {
      setRootFolders(rootFolders);
    })
    .catch((error)=>{
      console.error('Error getting root folders:', error);
      if (error?.message?.response?.request?.status === 409) {
        Toastify({ message: error.message.response.data.message, type: 'error' });
      } else {
        Toastify({ message: 'Failed to get root folders', type: 'error' });
      }
    })
  }, [doReload]);

 
  return (
    <>
      <TestFolder rootFoldersLength={rootFolders.length} setDoReload={setDoReload}/>
      <div className="root-folders-tests">
        {rootFolders && rootFolders.length > 0 && <TreeView testFolders={rootFolders}/> }
      </div>
      {/* <h2 className="test-list p-1">
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
      </div> */}
      </>
  );  
};

export default Tests;