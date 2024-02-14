import { useAppContext } from "../context/AppContext";
import TestFolder from "../components/AddTestFolder";
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from "react-intl";
import { getRootTestFolders, updateTestFolder } from '../services/testfolder.service';
import Toastify from '../components/common/Toastify';
import TreeView from "../pages/tree-view-test-folders/TreeView";

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

  const onNodeUpdate = (changedNode) => {
    updateTestFolder(changedNode)
    .then(()=> {
      Toastify({ message: 'Folder rearranged successfully', type: 'success' });
      setDoReload();
    })
    .catch((error)=>{
      console.error('Error getting root folders:', error);
      Toastify({ message: 'Failed to rearrange Folder', type: 'error' });
    })
  }

 
  return (
    <div className="p-2">
      <TestFolder rootFoldersLength={rootFolders.length} setDoReload={setDoReload}/>
      <div className="root-folders-tests">
        {rootFolders && rootFolders.length > 0 && <TreeView testFolders={rootFolders} onNodeUpdate={onNodeUpdate}/> }
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
      </div>
  );  
};

export default Tests;